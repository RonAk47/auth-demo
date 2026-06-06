const cloudinary = require('../config/cloudinary.config');

const uploadToCloudinary = async (filepath) => {
    try {
        const res = await cloudinary.uploader.upload(filepath);
        return {
            url: res.secure_url,
            publicId: res.public_id
        };
    } catch (err) {
        console.error('Error while uploading to cloudinary', err);
        throw new Error('Error while uploading to cloudinary');
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        //delete from cloudinary
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (err) {
        console.error('Error while deleting the image from cloudinary', err);
        throw new Error('Error while deleting the image from cloudinary');
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
