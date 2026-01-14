const mongoose = require('mongoose');

const fileSystemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    data: {
      type: Array, // Storing the entire file tree structure
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FileSystem = mongoose.model('FileSystem', fileSystemSchema);

module.exports = FileSystem;
