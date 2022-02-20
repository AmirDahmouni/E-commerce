const express = require('express')
const error = require("../middlewares/error")
const router = express.Router();
const config = require("config");
const stripe=require("stripe")(config.get("STRIPE"))


router.post("/",(req, res,next) => {
    console.log(req.body)
    const {product,token}=req.body;
    stripe.customers.create({
      email: token.email,
    })
    .then((customer) => {
      // have access to the customer object
      return stripe.invoiceItems
        .create({
          customer: customer.id, // set the customer id
          amount: product.price, // 25
          currency: 'USD',
          description: 'One-time setup fee',
        })
        .then((invoiceItem) => {
          return stripe.invoices.create({
            customer: invoiceItem.customer,
          });
        })
        .then((invoice) => {
          res.status(200).send(invoice)
        })
        .catch((err) => {
          next(err)
        });
    });
  },error)

module.exports=router;