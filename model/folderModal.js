const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
    },

    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    subFolder: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    permission: {
      type: String,
      enum: ["view", "edit", "both", "none"],
      default: "none",
    },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        default:null
      },
    ],
  },
  { timestamps: true }
);

const folderModal = mongoose.model("Folder", folderSchema);

module.exports = folderModal;
