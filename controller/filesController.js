const { catchAsyncError } = require("../middleware/catchAsyncError");
const {
  putObjectUrl,
  getObjectUrl,
  multipleSignedUrls,
} = require("../service/aws");
const { addFile, addFolder, getFolderById, deleteFileByKey,deleteFolderById} = require("../service/files");

const handlePostFile = catchAsyncError(async (req, res) => {
  const user = req.user;
  const { fileName, size, fileType, folderId, key } = req.body;
  const fileInfo = await addFile({
    key,
    folderId,
    fileName,
    size,
    fileType,
    owner: user._id,
    rootFolder: user.rootFolder,
  });

  res.status(200).json({
    success: true,
    message: "File saved",
    data: fileInfo,
    status_code: 200,
  });
});

const handlePostFolder = catchAsyncError(async (req, res) => {
  const user = req.user;

  const { folderName, parentFolder } = req.body;

  const folderInfo = await addFolder({
    folderName,
    parentFolder,
    owner: user._id,
    rootFolder:user.rootFolder
  });

  res.status(200).json({
    success: true,
    message: "Folder created",
    data: folderInfo,
    status_code: 200,
  });
});

const handleGetPutSignedUrl = catchAsyncError(async (req, res) => {
  const user = req.user;

  const { files_count } = req.query;

  const data = await multipleSignedUrls(files_count, user.username);

  res.status(200).json({
    success: true,
    message: "Upload url and key",
    data,
    status_code: 200,
  });
});
const handleGetViewSignedUrl = catchAsyncError(async (req, res) => {
  const { key } = req.query;
  const data = await getObjectUrl(key);

  res.status(200).json({
    success: true,
    message: "View link generated",
    link:data,
    status_code: 200,
  });
});

const handleGetFolder = catchAsyncError(async (req, res) => {
  const user = req.user;

  const { folderId } = req.query;

  const data = await getFolderById(folderId);
  res.status(200).json({
    success: true,
    message: "Folder Info fetched",
    data,
    status_code: 200,
  });
});

const handleDeleteFile=catchAsyncError(async(req,res)=>{
    const user=req.user

    const {key}=req.query

    const data=await deleteFileByKey(key)
    res.status(200).json({
        success: true,
        message: "successfully deleted",
        data,
        status_code: 200,
      });

})
const handleDeleteFolder=catchAsyncError(async(req,res)=>{
    const user=req.user

    const {id}=req.query

    const data=await deleteFolderById(id)
    res.status(200).json({
        success: true,
        message: "successfully deleted",
        data,
        status_code: 200,
      });

})
module.exports = {
  handlePostFile,
  handlePostFolder,
  handleGetPutSignedUrl,
  handleGetViewSignedUrl,
  handleGetFolder,
  handleDeleteFile,
  handleDeleteFolder
};
