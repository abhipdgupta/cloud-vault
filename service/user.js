const folderModal = require("../model/folderModal");
const userModal = require("../model/userModal");
const ErrorHandler = require("../utils/errorHandler");

const addUser = async ({ username, email, password }) => {
  try {
    if (!username || !email || !password)
      throw new ErrorHandler("Bad Request", 400);

    const userExist = await userModal.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (userExist)
      throw new ErrorHandler("Username or email already exists", 400);

    const user = new userModal({
      username,
      email,
      password,
      rootFolder: null,
    });

    const _user = await user.save();

    const rootFolder = new folderModal({
      folderName: _user.username,
      owner: _user._id,
    });

    const _rootFolder = await rootFolder.save();

    _user.rootFolder = _rootFolder._id;

    await _user.save();
    console.log("Register user details : ", _user);

    return _user;
  } catch (error) {
    throw error;
  }
};
const getUserById = async (id) => {
  try {
    const result = await userModal.findOne({ _id: id }).select("-password");

    return result;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const result = await userModal.findOne({ email: email });
    
    if(!result)throw new ErrorHandler(`Email doesn't exist`,400)

    return result;
  } catch (error) {
    console.log("ERROR IN getUserByEmail");
    throw error;
  }
};

module.exports = {
  addUser,
  getUserById,
  getUserByEmail,
};
