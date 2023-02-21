
const User=require('../models/userModel');
const bcrypt = require("bcrypt");

// Create Admin User
exports.createAdmin=async (req, res,next) => {
    try {
      const user = new User({
        name: 'ADMIN',
        email: 'admin@example.com',
        password: '123',
        isAdmin: true,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash("123", salt);
  
      const newUser = await user.save();
      return res.status(201).send(newUser);
    } catch (ex) {
      next(ex.message)
    }
}

//Create User
exports.register= async (req, res,next) => {
  try{
    let user = await User.findOne({
      email: req.body.email
    });
    if (user) return res.status(400).send({ message: 'invalid email' });
    
    if(req.body.password!==req.body.rePassword) return res.status(400).send({message:"invalid rePassword "})
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    const newUser = await user.save();
    //return newUser fields
    if (newUser) {
      
      return res.send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: false,
        token: newUser.generateAuth()
      });
    } 
    
    else {
      return res.status(401).send({ message: 'Invalid User Data' });
    }
  }
    catch(ex)
    {
      next(ex.message)
    }
  
}

// login user with (email & password)
exports.signin=async (req, res,next) => {
  try{
  const signinUser = await User.findOne({
    email: req.body.email
  });
  if (!signinUser) return res.status(404).send({ message: 'invalid email' });
  const validpassword = await bcrypt.compare(req.body.password, signinUser.password)
  if(!validpassword) return res.status(401).send({ message: 'Invalid Password.' });
  
  return res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      points:signinUser.points,
      token:signinUser.generateAuth()
    });
  }
  catch(ex)
  {
    next(ex.message)
  }
}

exports.update= async (req, res,next) => {
  try{
  
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    const salt = await bcrypt.genSalt(10);
    let newpassword=await bcrypt.hash(req.body.password, salt)
    // we update the field if req.body.name exist(!null) 
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = newpassword || user.password;
    const updatedUser = await user.save();
    //return updated user
  
    return res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: updatedUser.generateAuth(),
    });
  } else {
   return res.status(404).send({ message: 'User Not Found' });
  }
}
catch(ex)
{
  next(ex.message)
}
}

exports.clearCache=async(req,res,next)=>{
  try{
   
    const user=await User.findByIdAndUpdate({_id:req.user._id},{favoris:[]})
    return res.status(200).send(user)
  }
  catch(ex)
  {
    next(ex.message)
  }
}