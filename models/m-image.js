const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'tblusers',
        required: false
    },
    title: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    likedBy: {
        items: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'tblusers',
                    required: false
                }
            }
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('tblimages', imageSchema);