const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var {v4 : uuidv4} = require('uuid');
const mongoosePaginate = require('mongoose-paginate-v2');



const router = express.Router();

const userRouter = require("./auth/routes/user.router.js")

router.use("/",userRouter)


const cors = require('cors');
const { json } = require("body-parser");
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','PATCH']
}));


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json({limit: '50mb'}));

app.use("/",userRouter)

mongoose.connect("mongodb://localhost:27017/BlogDB", {useNewUrlParser: true});


app.listen(3000,function(){
    console.log("server running at port 3000")
});