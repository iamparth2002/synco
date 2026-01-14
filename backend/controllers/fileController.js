const asyncHandler = require('express-async-handler');
const File = require('../models/File');

// @desc    Get all files (metadata only)
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
  // Fetch all files for user, exclude heavy content fields
  const files = await File.find({ user: req.user.id })
    .select('-content -nodes -edges')
    .sort({ createdAt: 1 });

  // If no files, create initial structure (Welcome, etc.)
  if (files.length === 0) {
    const initialFiles = [
      { name: "Root", type: "folder", parentId: null, user: req.user.id },
    ];
    // Create root first to get its ID if we were doing real relational, 
    // but here we just create them. 
    // Actually, let's just creating a simple structure.

    const root = await File.create({ name: "Root", type: "folder", parentId: null, user: req.user.id });

    const personal = await File.create({ name: "Personal", type: "folder", parentId: root._id, user: req.user.id });
    await File.create({ name: "Journal", type: "file", parentId: personal._id, content: "My dear diary...", user: req.user.id });
    await File.create({ name: "Ideas", type: "file", parentId: personal._id, content: "App ideas...", user: req.user.id });

    const work = await File.create({ name: "Work", type: "folder", parentId: root._id, user: req.user.id });
    await File.create({ name: "Project A", type: "file", parentId: work._id, content: "Project specs...", user: req.user.id });

    await File.create({ name: "Welcome", type: "file", parentId: root._id, content: "Welcome to Synco!", user: req.user.id });
    await File.create({ name: "My Canvas", type: "canvas", parentId: root._id, nodes: [], edges: [], user: req.user.id });

    const newFiles = await File.find({ user: req.user.id }).select('-content -nodes -edges');
    res.status(200).json(newFiles);
  } else {
    res.status(200).json(files);
  }
});

// @desc    Get single file content
// @route   GET /api/files/:id
// @access  Private
const getFileContent = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, user: req.user.id });
  if (file) {
    res.status(200).json(file);
  } else {
    res.status(404);
    throw new Error('File not found');
  }
});

// @desc    Create a new file/folder
// @route   POST /api/files
// @access  Private
const createFile = asyncHandler(async (req, res) => {
  const { name, type, parentId, content, nodes, edges } = req.body;

  const file = await File.create({
    user: req.user.id,
    name,
    type,
    parentId,
    content,
    nodes,
    edges
  });

  res.status(201).json(file);
});

// @desc    Update a file
// @route   PUT /api/files/:id
// @access  Private
const updateFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, user: req.user.id });

  if (file) {
    // Update fields if they exist in body
    if (req.body.name !== undefined) file.name = req.body.name;
    if (req.body.content !== undefined) file.content = req.body.content;
    if (req.body.nodes !== undefined) file.nodes = req.body.nodes;
    if (req.body.edges !== undefined) file.edges = req.body.edges;
    if (req.body.parentId !== undefined) file.parentId = req.body.parentId;

    const updatedFile = await file.save();
    res.json(updatedFile);
  } else {
    res.status(404);
    throw new Error('File not found');
  }
});

// @desc    Delete a file and its children
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, user: req.user.id });

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  // Helper to find all descendant IDs
  const findAllDescendants = async (parentId) => {
    const children = await File.find({ parentId, user: req.user.id });
    let ids = [];
    for (const child of children) {
      ids.push(child._id);
      const grandChildrenIds = await findAllDescendants(child._id);
      ids = ids.concat(grandChildrenIds);
    }
    return ids;
  };

  const descendants = await findAllDescendants(file._id);

  // Delete file and all descendants
  await File.deleteMany({
    _id: { $in: [file._id, ...descendants] },
    user: req.user.id
  });

  res.json({ message: 'File and descendants removed' });
});

module.exports = {
  getFiles,
  getFileContent,
  createFile,
  updateFile,
  deleteFile
};
