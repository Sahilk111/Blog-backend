const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    fullname : String,
    email : String,
    password : String,
    author_id : String
})

module.exports = mongoose.model('user', userSchema);
