const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');



const articleSchema = new mongoose.Schema({
    title : String,
    description : String,
    content : String,
    author_id : String,
    blog_id : String

})

articleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Article', articleSchema);