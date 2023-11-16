const { catchAsyncError } = require("../middleware/catchAsyncError");
const { addUser, getUserByEmail } = require("../service/user");
const ErrorHandler = require("../utils/errorHandler");
const { setjwt } = require("../utils/jwt");

const handleUserRegister = catchAsyncError(async (req, res) => {
  const { username, email, password } = req.body;

  const result = await addUser({ username, email, password });

  res.status(200).json({
    success: true,
    message: "User register successfully",
    data: result,
    status_code: 200,
  });
});
const handleGetUserInfo = catchAsyncError(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "User Info",
    data: user,
    status_code: 200,
  });
});

const handleUserLogin=catchAsyncError(async(req,res)=>{
    const {email,password}=req.body

    const user=await getUserByEmail(email)

    let token=null
    if(user.password===password){
        token=await setjwt(user._id)
        
    }

    if(!token)throw new ErrorHandler('Wrong password',400)

    delete user.password

    res.status(200).json({
        success:true,
        token,
        user,
        message:'Login successfully',
        status_code:200
    })


})

module.exports = {
  handleUserRegister,
  handleGetUserInfo,
  handleUserLogin
};
