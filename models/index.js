var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , env       = process.env.NODE_ENV || 'development'
  , config    = require(__dirname + '/../config/config.json')[env]
  , sequelize = new Sequelize(config.database, config.username, config.password, config)
  , db        = {}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})


// db.author.create({name: "Jim Bob"}).success(function(author){
//   console.log(author)
// });

db.author.hasMany(db.post);
db.post.belongsTo(db.author);


// add from routes to place holders 
// db.post.create()
//   .success(function(post){
//     db.author.find().success(function(author){
//       author.setPosts([post])
//       .success(function(author) {
//         console.log(author)
//       });
//     });
//   });


module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
