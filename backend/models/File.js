const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    parentId: {
      type: String,
      default: null, // null for root level items
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['folder', 'file', 'canvas'],
      required: true,
    },
    content: {
      type: String, // For notes/files
      default: "",
    },
    nodes: {
      type: Array, // For canvas
      default: [],
    },
    edges: {
      type: Array, // For canvas
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
