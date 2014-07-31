var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  flash = require("connect-flash"),
  app = express(),
  db = require("./models/index");
app.use(bodyParser.urlencoded());

app.set("view engine", "ejs");

app.use(cookieSession({
	secret: 'secretkey',
	name: 'cookie created by P',
	maxage: 400000
}));

app.use(passport.initalize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done) {
	console.log('SERIALIZED JUST MUFKIN RAN SON')
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('DESERIALIZED JUST MUFKIN RAN SON');
	db.user.find({
		where: {
			id: id
		}
	}).done(function(error, user) {
		done(error, user);
	});
});

app.get('/', function(req,res) {
	if(!req.user) {
		res.render('index');
	}
	else {
		res.redirect('/home');
	}
});

app.get('/signup', function(req,res) {
	if(!req.user) {
		res.render('signup');
	}
	else {
		res.redirect('/home');
	}
});

app.post('/create', function(req,res){	
   
  db.user.createNewUser(req.body.username, req.body.password, 
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});


app.get('/home', function(req,res){
  res.render("home", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});


app.get("/authors", function(req, res){

  db.author.findAll().success(function(authors){
    res.render('index', {authors: authors})
  })
});

app.get('/new', function(req,res) {
	res.render('new')
});
//Does not allow new post by same author. Need to fix.
app.post('/posts', function(req, res) {
	var name = req.body.authorName
		db.author.find({name: name}).success(function(author){
		var post = db.post.build({post: req.body.blogPost, authorId: author.id}); // may need to be author.DataValues.id
		author.addPost(post).success(function(post){
				res.redirect('/authors')
					}) // post.save()
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
