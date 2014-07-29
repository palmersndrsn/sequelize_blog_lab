var express = require("express"),
  db = require("./models/index.js"),
  app = express();

app.set("view engine", "ejs");

app.get("/authors", function(req, res){

  db.author.findAll().success(function(authors){
    res.render('index', {authors: authors})
  })
})

app.get('/new', function(req,res) {
	res.render('new')
})

app.post('/new', function(req, res) {
	db.author.create({name: authorName}).success(function(author){
		console.log(author)
	
		db.post.create({post: blogPost}).success(function(post){
			console.log(post)
			});
	});
}
// db.author.create({name: "Jim Bob"}).success(function(author){
//   console.log(author)
// });

app.listen(3000, function(){
	console.log('Systems Online!')
})

