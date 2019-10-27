const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
    },
    post_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    posted_on: {
        type: Date,
        trim: true,
        required: true
    },
    likes: {
        type: Number,
    }
});

module.exports = mongoose.model('Comment', CommentSchema)
