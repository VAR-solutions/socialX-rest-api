const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    photo: {
        data: Buffer, contentType: String
    },
    posted_on: {
        type: Number,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [
        {
            content: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema)
