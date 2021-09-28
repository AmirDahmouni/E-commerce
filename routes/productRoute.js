const express = require('express')
const productController=require("../controllers/Product")
const isAuth=require("../middlewares/checkAuth")
const isAdmin=require("../middlewares/isAdmin")
const error = require("../middlewares/error")
const router = express.Router();


router.get('/',productController.getAll,error);
router.get("/topsold",productController.getTop,error)
router.get("/cache/",isAuth,productController.gettingByCache,error)
router.get("/categories",productController.getCategories,error)
router.get("/cache/:id",isAuth,productController.createCache,error)
router.get('/:id',productController.getById,error);
router.post('/:id/reviews', isAuth,productController.addReview,error );
router.put('/:id', isAuth, isAdmin, productController.update,error);
router.delete('/:id', isAuth, isAdmin,productController.remove,error );
router.post('/', isAuth, isAdmin,productController.create,error);

module.exports=router;
