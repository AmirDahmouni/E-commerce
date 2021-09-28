const express = require('express')
const isAuth=require("../middlewares/checkAuth"); //middlewares
const userController=require("../controllers/User")
const error=require("../middlewares/error")
const router = express.Router();

router.put('/clearcache',isAuth,userController.clearCache,error)
router.put('/:id', isAuth,userController.update,error);
router.post('/signin', userController.signin,error);
router.post('/register',userController.register,error);
router.get('/createadmin',userController.createAdmin,error);


module.exports=router;
