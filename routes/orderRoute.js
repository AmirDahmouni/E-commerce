const express = require('express')
const orderController=require("../controllers/Order")
const isAuth=require("../middlewares/checkAuth")
const isAdmin=require("../middlewares/isAdmin")
const error = require("../middlewares/error")
const router = express.Router();

router.get("/", isAuth,orderController.getAll,error);
router.get("/mine", isAuth, orderController.getByUser,error);
router.get("/:id", isAuth,orderController.getById,error);
router.delete("/:id", isAuth, isAdmin,orderController.removeById,error);
router.post("/", isAuth,orderController.create,error);
router.put("/:id/pay", isAuth,orderController.pay,error);
router.put("/:id/payByPoints", isAuth,orderController.payByPoints,error);

module.exports=router;