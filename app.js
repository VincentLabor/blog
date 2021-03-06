//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connection String for mongoose database
mongoose.connect('mongodb://127.0.0.1:27017/basicblogDB', {
  useNewUrlParser: true
});

//This will test if we are connected to mongoDB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We are connected to the mongoDB!")
});

//Schema for the mongoose model to follow
let Schema = mongoose.Schema;

let blogSchema = new Schema({
  postTitle: String,
  postBody: String
});

let Blog = mongoose.model('Blog', blogSchema);

var blog1 = new Blog({
  postTitle: "Home",
  postBody: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
})

let blog2 = new Blog({
  postTitle: "Day 1",
  postBody: "I am hunry for knowledge"
})


//The Home route
app.get("/", function (req, res) {
  Blog.find({}, function (err, blogPosts) {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: blogPosts
      });
    }
  })
});


//The About page
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
})

//The Contact page
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
})

//The Compose page
app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {

  let postTitle = req.body.postTitle;
  let postBody = req.body.postBody;

   const blogPost = new Blog({
     postTitle: postTitle,
     postBody: postBody
   })
   blogPost.save();
  res.redirect("/");
})

app.get("/posts/:postTitle", function (req, res) {
  let requestedTitle = req.params.postTitle;
  let requestedBody = req.params.postBody;

  Blog.findOne({postTitle: requestedTitle}, function(err,blogPost){
    if(!err){
      if(_.lowerCase(requestedTitle) === _.lowerCase(blogPost.postTitle)){
        res.render("post",
        {postTitle: requestedTitle,
        postBody: blogPost.postBody})
      }
    } else{ 
      console.log(err)
    }
  })
  // posts.forEach(function (post) {
  //   if (_.lowerCase(requestedTitle) === _.lowerCase(post.postTitle)) {
  //     res.render("post", {
  //       postTitle: post.postTitle,
  //       postBody: post.postBody
  //     })
  //   } else {
  //     console.log("There is no match");
  //   }

  // })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});