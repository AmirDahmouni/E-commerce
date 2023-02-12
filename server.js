const mongoose = require('mongoose');
const fileUpload = require('express-fileupload')
require('dotenv').config();

//import routes
const userRoute=require("./routes/userRoute");
const productRoute =require('./routes/productRoute');
const orderRoute=require('./routes/orderRoute');
const paymentRoute=require("./routes/paymentRoute")
const {uploadRoute}=require('./routes/uploadRoute');

const express = require('express')
const app = express();

//connection to MongoDb

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(res => console.log("connected to DB ..."))
  .catch((error) => console.log(error));

//appel au middlewares 

app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//declaration APIs

app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment',paymentRoute);


// server listening
app.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`);
});
