const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Number,
      enum: [1, 2],
      default: 2,
    },
    password: {
      type: String,
      required: true,
    },
    rootFolder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Folder',    
    }
  },
  { timestamps: true }
);

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
