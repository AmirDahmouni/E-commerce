const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const express = require('express')
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_Key,
    api_secret: process.env.API_Secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => new Date().toISOString() + '-' + file.originalname,
    }
});

const uploadImage = async (req, res, next) => {
    if (req.files.Image) 
    {
    
        cloudinary.uploader.upload_large(req.files.Image.tempFilePath, { resource_type: 'image' },
         async (err, result) => {
            console.log(result.secure_url)
            
            return res.send(result.secure_url)
        })
    } 
    else {
        return res.status(500).send({error:"error"})
    }
}

router.post('/s3',uploadImage);


exports.parser = multer({ storage: storage });
exports.uploader = cloudinary.uploader;
exports.uploadRoute=router;