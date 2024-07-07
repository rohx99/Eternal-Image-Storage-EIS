const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    image : {
        type : String
    }
});

module.exports = mongoose.model('Post', postSchema)