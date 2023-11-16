const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    default:''
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  permission:{
    type:String,
    enum:['view','edit','both','none'],
    default:'none'
  },
  visibility:{
    type:String,
    enum:['private','public'],
    default:'private'
  },
  key:{
    type:String,
    required:true,
  }
 
},{timestamps:true});

const fileModal = mongoose.model('File', fileSchema);

module.exports = fileModal;
