const { handlePostFile, handleGetFolder, handlePostFolder, handleDeleteFile,handleDeleteFolder } = require('../controller/filesController')
const { requireUserAccess } = require('../middleware/checkAuth')

const router=require('express').Router()


router.post('/create_file',requireUserAccess,handlePostFile)

router.get('/folder_info',requireUserAccess,handleGetFolder)

router.post('/create_folder',requireUserAccess,handlePostFolder)

router.delete('/delete_file',requireUserAccess,handleDeleteFile)

router.delete('/folder_delete',requireUserAccess,handleDeleteFolder)


module.exports=router
