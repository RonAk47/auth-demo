const {
    uploadToCloudinary,
    deleteFromCloudinary
} = require('../helpers/cloudinary.helper');
const Image = require('../models/image.model');
const fs = require('fs');
const { USER_ROLES } = require('../utils/constants');

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

const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.id;
        if (!imageId) {
            return res.status(400).json({
                success: false,
                message: 'Image id is required'
            });
        }

        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image with provided id does not exists'
            });
        }

        const userId = req.userInfo?.userId;
        const userRole = req.userInfo?.role || USER_ROLES.USER;
        if (userRole !== USER_ROLES.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Only admins are allowed to delete the images'
            });
        }

        //Check if the user trying to delete the id is the uploader or not
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not authorized to delete images uploaded by another admin'
            });
        }

        //If the current user is the uploader, then delete from cloudinary and then from MongoDb
        if (!image?.publicId) {
            return res.status(400).json({
                success: false,
                message:
                    'PublicId does not exists in the database while deleting image'
            });
        }
        const deleteImageFromCloudinary = await deleteFromCloudinary(
            image.publicId
        );

        if (deleteImageFromCloudinary?.result !== 'ok') {
            throw new Error(
                'Something went wrong while deleting image from cloudinary'
            );
        }

        const deleteFromMongo = await image.deleteOne();
        if (deleteFromMongo.deletedCount !== 1) {
            throw new Error('Failed to delete image from MongoDB');
        }
        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (err) {
        console.error('Error while deleting the image', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while deleting the image'
        });
    }
};

module.exports = { uploadImage, fetchImages, deleteImage };
