function Post(sequelize, DataTypes){
  return sequelize.define('post', {
    post: DataTypes.STRING
  });
};



module.exports = Post;