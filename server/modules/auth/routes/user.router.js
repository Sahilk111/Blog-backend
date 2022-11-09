const { Router } = require("express");
const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.route("/register").post(userController.userRegister);

router.route("/login").post(userController.userLogin);

router.route("/home").get(userController.blogHome);

router.route("user/:author_id").get(userController.userProfile);

router.route("/new/:author_id").post(userController.newPost);

router.route("/user/:blog_id").patch(userController.updatePost);

router.route("/user/:blog_id").delete(userController.deletePost);

module.exports = router;


