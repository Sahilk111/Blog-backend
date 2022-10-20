const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE']
}));


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json({limit :'50mb'}));

mongoose.connect("mongodb://localhost:27017/BlogDB", {useNewUrlParser: true});

const userSchema = ({
    fullname : String,
    email : String,
    password : String
})

const User =  mongoose.model("User",userSchema);


app.get("/login", cors(), function(req,res){
    const user = new User({
        email : req.body.email,
        password : req.body.password
    }); 
    res.send("Success")
})

app.post("/register", cors(), function(req,res){
     console.log(req.body);
    const user = new User({
        fullname : req.body.fullname,
        email: req.body.email,
        password: req.body.password
    }); 

    console.log(user);
    user.save(function(err){
        if(!err){
            res.json("Successfully added")
        }else{
           res.send(err);
        }
    });
    
});

app.post("/login",function(req,res){

    const email_id = req.body.email;
    const login_password= req.body.password;
    
    User.findOne({email : email_id},function(err,foundUser){
        if(err){
            res.send("");
        }else{
            if(foundUser){
                if(foundUser.password === login_password){
                    res.send("Successfully logged in")
                }else{
                    res.send("invalid password");
                }
            }
        }
    })

    }); 

app.listen(3000,function(){
    console.log("server running at port 3000")
});