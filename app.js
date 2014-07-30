var express = require("express"),
  db = require("./models/index.js"),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  app = express();

app.use(bodyParser.urlencoded());

app.set("view engine", "ejs");

app.get("/authors", function(req, res){

  db.author.findAll().success(function(authors){
    res.render('index', {authors: authors})
  })
});

app.get('/new', function(req,res) {
	res.render('new')
});
//somehow this deletes the previous post with the same author
app.post('/posts', function(req, res) {
	var name = req.body.authorName
		db.author.findOrCreate({name: name}).success(function(author){
		var post = db.post.build({post: req.body.blogPost});
		author.addPost(post).success(function(post){
				res.redirect('/authors')
			});
	});
});

app.get('/author/:id', function(req, res) {
	var index = req.params.id
	db.post.findAll({where: {authorId: index} }).success(function(currentPosts) {
		console.log(currentPosts)
			res.render('author', {posts: currentPosts})
	})


})

app.listen(3000, function(){
	console.log('Systems Online!')
});
