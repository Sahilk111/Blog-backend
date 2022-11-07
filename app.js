const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var {v4 : uuidv4} = require('uuid');
const mongoosePaginate = require('mongoose-paginate-v2');


const cors = require('cors');
const { json } = require("body-parser");
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','PATCH']
}));


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json({limit: '50mb'}));

mongoose.connect("mongodb://localhost:27017/BlogDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    fullname : String,
    email : String,
    password : String,
    author_id : String
})

const User =  mongoose.model("User",userSchema);

const articleSchema = new mongoose.Schema({
    title : String,
    description : String,
    content : String,
    author_id : String,
    blog_id : String

})

articleSchema.plugin(mongoosePaginate)

const Article =  mongoose.model("Article",articleSchema);


app.get("/home",function(req,res){

    const options = {
        page: req.query.page,
        limit: req.query.limit,
        collation: {
          locale: 'en',
        },
      };

       Article.paginate({}, options, function (err, result) {

        if(err){
            res.send(err)
        }else{
            res.send(result);
        }

      });
    });




app.post("/new/:author_id",function(req,res){

    const article = new Article({
        title : req.body.title,
        description: req.body.description,
        content: req.body.content,
        blog_id : uuidv4(),
        author_id: req.params.author_id
    }) 

    article.save(function(err){
        if(!err){
            console.log(article);
            res.status(200).json("blog added")
        }else{
           res.status(401).json(err);
           
        }
    });


})

app.get("/user/:author_id", function(req,res){

    Article.find({author_id: req.params.author_id}, function(err,userArticles){
        if(!err){
            res.status(200).json(userArticles)
        }else{
            res.status(401).json(err);
        }
    })


})


app.patch("/user/:blog_id",function(req,res){
    
    Article.findOneAndUpdate(
        {blog_id :req.params.blog_id},
        {$set : req.body},
        function(err){
            if(!err){
                res.status(200).json("Successfully updated article")
            }else{
                res.status(200).json(err)
            }
        }
    )
  })

  app.delete("/user/:blog_id",function(req,res){
    Article.deleteOne(
        {blog_id: req.params.blog_id},
        function(err){
            if(!err){
                res.json("successfully deleted")
            }else{
                res.json(err)
            }
        } 
    );
  });


app.get("/login", cors(), function(req,res){
    const user = new User({
        email : req.body.email,
        password : req.body.password
    }); 
    res.send("Success")
})

app.post("/login", cors(), function(req,res){

    const email_id = req.body.email;
    const login_password= req.body.password;
    
    User.findOne({email : email_id},function(err,foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser){
                if(foundUser.password === login_password){
                    res.status(200).json(foundUser.author_id)
                }else{
                    res.status(401).json("invalid password");
                }
            }
        }
    })
})

app.post("/register", cors(), function(req,res){
   const user = new User({
       fullname : req.body.fullname,
       email: req.body.email,
       password: req.body.password,
       author_id : uuidv4()
   }) 

   console.log(user);
   user.save(function(err){
       if(!err){
           res.status(200).json("Successfully added")
       }else{
          res.status(401).json(err);
          console.log(err)
       }
   });
   
});



app.listen(3000,function(){
    console.log("server running at port 3000")
});