const mongoose = require('mongoose');
const config = require('config');
const fileUpload = require('express-fileupload')



//import routes
const userRoute=require("./routes/userRoute");
const productRoute =require('./routes/productRoute');
const orderRoute=require('./routes/orderRoute');
const paymentRoute=require("./routes/paymentRoute")
const {uploadRoute}=require('./routes/uploadRoute');

const express = require('express')
const app = express();



//connection to MongoDb

mongoose.connect(config.get("MONGODB_URL"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

//routes declaration

app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment',paymentRoute );


// server listening
app.listen(config.get("PORT"), () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
