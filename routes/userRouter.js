const { handleUserRegister,handleGetUserInfo,handleUserLogin } = require('../controller/userController')
const { requireUserAccess } = require('../middleware/checkAuth')

const router=require('express').Router()


// /user
router.post('/register',handleUserRegister)
router.post('/login',handleUserLogin)
router.get('/info',requireUserAccess,handleGetUserInfo)







module.exports=router
