const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {type: String, required: true, unique: true, index: true, dropDups: true},
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  points:{type:Number,required:true,default:0},
  favoris:[{
    category:{type:String,required:false},
    indicator:{type:Number,required:true}
  }]
});
userSchema.methods.generateAuth = function () {
  //generate token for user payload(_id,name,email,isAdmin) using JWT_SECRET
  // expired period 48h
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      points:this.points
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const userModel = mongoose.model('User', userSchema);
module.exports=userModel;
