const Order=require('../models/orderModel');
const User=require("../models/userModel");
const Product=require("../models/productModel");
const mongoose = require('mongoose');

exports.getAll=async (req,res,next)=>{
      try{
        const orders = await Order.find({}).populate('user');
        //return orders
        res.send(orders);
      }
      catch(ex)
      {
        next(ex.message)
      }
}
// get all user orders by user._id
exports.getByUser=async (req, res,next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    //return orders
    res.send(orders);
  }
  catch(ex)
  {
    next(ex.message)
  }
}

// get One order By Id
exports.getById=async (req, res,next) => {
  try{
    const order = await Order.findOne({ _id: req.params.id });
    if (order) {
      //return order
      res.send(order);
    } else {
      res.status(404).send("Order Not Found.")
    }
  }
  catch(ex)
  {
    next(ex.message)
  }
    
}

  //delete one Order By Id
exports.removeById=async (req, res,next) => {
  try
  {
    const order = await Order.findOne({ _id: req.params.id });
    if (order) {
      const deletedOrder = await order.remove();
      //return deleted Order
      res.send(deletedOrder);
    } else {
      //order not found
      res.status(404).send("Order Not Found.")
    }
  }
  catch(ex)
  {
  next(ex.message)
  }
}

//create new Order
exports.create=async (req, res,next) => {
    try{
      console.log("create new order")
    const newOrder = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: {
        paymentMethod:req.body.pay,
        payerID: " ",
        orderID:" ",
        paymentID:" "
      },
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const pointsbonus= Math.round(Number(req.body.itemsPrice)/100*27)
    
    if(req.body.pay=="card")
    {  
    const currentUser=await User.findByIdAndUpdate(req.user._id,{$inc:{points:pointsbonus}})
    await currentUser.save()
    }
    const newOrderCreated = await newOrder.save();
    if(!newOrderCreated) return res.status(404).send("Order Not Created")
    return res.status(200).send({ message: "New Order Created", data: newOrderCreated });
  }
  catch(ex)
  {
    next(ex.message)
  }
}
//modify payment oreder by Id
exports.pay=async (req, res,next) => {
  try{
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered=true;
      order.isPaid = true;
      order.deliveredAt=Date.now();
      order.paidAt = Date.now();
      order.payment = {
          paymentMethod: "card",
          payerID: req.body.payerID,
          orderID: req.body.orderID,
          paymentID: req.body.paymentID
      }
      const updatedOrder = await order.save();

      //inc sold of items in product Model
    
      Promise.all(updatedOrder.orderItems.map(async (item)=>{
        let id=item.product
        await Product.findByIdAndUpdate({_id:id},{ $inc: {sold:1}  })
      }))
      
    
      res.send({ message: 'Order Paid by card.', order: updatedOrder });
      
    } else {
      res.status(404).send({ message: 'Order not found.' })
    }
  }
    catch(ex)
    {
      next(ex.message)
    }
}

exports.payByPoints=async (req, res,next) => {
  try{
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered=true;
      order.isPaid = true;
      order.deliveredAt=Date.now();
      order.paidAt = Date.now();
      order.payment = {
        paymentMethod: "points",
          payerID: req.body.payerID,
          orderID: req.body.orderID,
          paymentID: req.body.paymentID
      }
      //const newpoints=req.user.points-req.body.points
      const currentUser=await User.findByIdAndUpdate(req.user._id,{$inc:{points:-req.body.points}})
    
      await currentUser.save()
  
      const updatedOrder = await order.save();
      
      Promise.all(updatedOrder.orderItems.map(async (item)=>{
        let id=item.product
        await Product.findByIdAndUpdate({_id:id},{ $inc: {sold:1}  })
      }))

      res.send({ message: 'Order Paid by points.', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order not found.' })
    }
   } 
    catch(ex)
    {
      next(ex.message)
    }
}