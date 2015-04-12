

// Database Connect

// var MongoClient = require('mongodb').MongoClient;




/**
 * Module dependencies.
 */

var render = require('../lib/render');
var posts = require('../models/posts_model');
var postCounter;
var listPosts;

// Database

/**
 * Define `Routes`.
 */

var Routes = {};

Routes.list = function *list() {
  this.body = yield render('list', { posts: posts });
}

Routes.add = function *add() {
  this.body = yield render('new');
}

Routes.show = function *show(id) {
  var post = posts[id];
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
}

Routes.create = function *create() {
  // var post = {
  // 	title: this.request.body.title,
  // 	body: this.request.body.body
  // }
  // var id = posts.push(post) - 1;
  // post.created_at = new Date;
  // post.updated_on = new Date;
  // post.id = id;
  // MongoClient.connect("mongodb://localhost/postsDb", function(err, db) {
  //   if(!err) {
  //     console.log("We are connected");

  //     var collection = db.collection('posts');
  //     console.log(this.request.body)
  //     var post = {
                     // _id: index,
                     // created_at: new Date,
                     // updated_on: new Date,
                     // title: this.request.body.title,
                     // body: this.request.body.body
  //                 }

  //     collection.insert(post, {w:1}, function(err, result) {});
  //   }
  // });

  posts.findOne( { tracker: "post_counter" }, function (e, counter) {
    return postCounter = counter.counter
  })

  console.log(postCounter)

  var newPost = {
      _id: postCounter,
      created_at: new Date,
      updated_on: new Date,
      title: this.request.body.title,
      body: this.request.body.body
    }


  yield posts.insert(newPost);

  yield posts.findAndModify({ query: {tracker: "post_counter"}, update: {tracker: "post_counter", counter: postCounter++} })

  this.redirect('/');
}

Routes.edit = function *edit(id) {
    var post = posts[id];
    if (!post) this.throw(404, 'invalid post id');
    this.body = yield render('edit', { post: post });
}

Routes.update = function *update() {
    var post = {
      title: this.request.body.title,
      body: this.request.body.body
    }
    var index = this.request.body.id;
    posts[index].title = post.title;
    posts[index].body = post.body;
    posts[index].updated_on = new Date;
    this.redirect('/');
}

Routes.remove = function *remove(id) {
    var post = posts[id];
    if (!post) this.throw(404, 'invalid post id');
   posts.splice(id,1);
    //Changing the Id for working with index
    for (var i = 0; i < posts.length; i++)
    {
        posts[i].id = i;
    }
    this.redirect('/');
}

/**
 * Expose `Routes`.
 */

module.exports = Routes;
