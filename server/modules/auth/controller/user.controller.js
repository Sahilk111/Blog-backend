var {v4 : uuidv4} = require('uuid');
const mongoosePaginate = require('mongoose-paginate-v2');

//articleSchema.plugin(mongoosePaginate)

//const Article =  mongoose.model("Article",articleSchema);


const User = require("../models/user.model");
const Article = require("../models/article.model");



const userRegister = function(req,res){

        console.log("register");
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
        
}


const userLogin = function(req,res){

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
}

const blogHome = function(req,res){

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
    }

    const newPost = function(req,res){

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
    }

    const userProfile = function(req,res){

        Article.find({author_id: req.params.author_id}, function(err,userArticles){
            if(!err){
                res.status(200).json(userArticles)
            }else{
                res.status(401).json(err);
            }
        })
    }

    const updatePost = function(req,res){
    
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
    }

    const deletePost = function(req,res){
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
    }


module.exports = {
    userRegister,
    userLogin,
    blogHome,
    newPost,
    userProfile,
    updatePost,
    deletePost
  };