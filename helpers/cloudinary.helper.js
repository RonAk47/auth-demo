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

module.exports = uploadToCloudinary;
