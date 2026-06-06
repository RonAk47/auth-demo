const uploadToCloudinary = require('../helpers/cloudinary.helper');
const Image = require('../models/image.model');
const fs = require('fs');

const uploadImage = async (req, res) => {
    try {
        //check if file is missing
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required, please upload an image'
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);
        //Store image url

        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newImage.save();

        //Delete file from disk
        fs.unlinkSync(req.file.path);

        return res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newImage
        });
    } catch (err) {
        console.error('Error while uploading image to cloudinary', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while uploading image'
        });
    }
};

const fetchImages = async (req, res) => {
    try {
        const images = await Image.find({});

        return res.status(200).json({
            status: true,
            message: images.length
                ? 'Images fetched successfully'
                : 'No images found',
            data: images
        });
    } catch (err) {
        console.error('Error while fetching the images', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while fetching the images'
        });
    }
};

module.exports = { uploadImage, fetchImages };
