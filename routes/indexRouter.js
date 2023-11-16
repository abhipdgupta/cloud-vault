const { handleGetPutSignedUrl,handleGetViewSignedUrl } = require('../controller/filesController')
const { requireUserAccess } = require('../middleware/checkAuth')

const router=require('express').Router()



router.get('/put_signed_url',requireUserAccess,handleGetPutSignedUrl)
router.get('/view_signed_url',requireUserAccess,handleGetViewSignedUrl)

module.exports=router
