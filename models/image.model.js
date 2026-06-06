const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        uploadedBy: {
            type: moongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('image', imageSchema);
