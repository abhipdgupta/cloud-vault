const ErrorHandler = require("../utils/errorHandler");
const fileModal = require("../model/fileModal");
const folderModal = require("../model/folderModal");
const { getObjectUrl, deleteObject } = require("./aws");

const addFile = async ({
  key,
  folderId,
  fileName,
  size,
  fileType,
  owner,
  rootFolder,
}) => {
  try {
    const file = new fileModal({
      fileName,
      size,
      fileType,
      owner,
      key,
    });

    const _file = await file.save();
    if (folderId) {
      await folderModal.findOneAndUpdate(
        { _id: folderId },
        { $push: { files: _file._id } }
      );
    } else {
      await folderModal.findOneAndUpdate(
        { _id: rootFolder },
        { $push: { files: _file._id } }
      );
    }

    return _file;
  } catch (error) {
    throw error;
  }
};

const addFolder = async ({
  folderName,
  parentFolder = null,
  owner,
  rootFolder,
}) => {
  try {
    const existingFolder = await folderModal.findOne({
      folderName,
      owner,
      parentFolder: parentFolder || rootFolder,
    });

    if (existingFolder) {
      throw new ErrorHandler("Folder with the same name already exists", 400);
    }

    const folderInfo = {
      folderName,
      owner,
      parentFolder: parentFolder || rootFolder,
    };

    const folder = new folderModal(folderInfo);
    const _folder = await folder.save();

    await folderModal.findOneAndUpdate(
      { _id: _folder.parentFolder },
      { $push: { subFolder: _folder._id } }
    );

    return _folder;
  } catch (error) {
    throw error;
  }
};

const getFolderById = async (folderId) => {
  try {
    const data = await folderModal
      .find({ _id: folderId })
      .populate("subFolder")
      .populate("files");

    const files = data[0].files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const link = await getObjectUrl(files[i].key);
        files[i].link = link;
      }
    }

    console.log(data[0].files);

    return data;
  } catch (error) {
    throw error;
  }
};

const createRootFolderByUserId = async ({ folderName, owner }) => {
  try {
    const folderInfo = {
      folderName,
      owner,
    };

    const folder = new folderModal(folderInfo);
    return await folder.save();
  } catch (error) {
    throw error;
  }
};

const deleteFileByKey = async (key) => {
  try {
    const file = await fileModal.findOneAndDelete({ key: key });
    if (!file) throw new ErrorHandler("File Doesnot exist", 404);

    await deleteObject(key)

    return file;
  } catch (error) {
    throw error;
  }
};

const deleteFolderById=async(id)=>{
    try {
        const file = await folderModal.findOneAndDelete({ _id: id });
        if (!file) throw new ErrorHandler("Folder Doesnot exist", 404);
    
        // await deleteObject(key)
    
        return file;
      } catch (error) {
        throw error;
      }
}
module.exports = {
  addFile,
  addFolder,
  getFolderById,
  createRootFolderByUserId,
  deleteFileByKey,
  deleteFolderById
};
