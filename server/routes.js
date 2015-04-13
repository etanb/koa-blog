// To create the initial counter

// var mongo = process.env.MONGOHQ_URL || 'mongodb://localhost/postsDb'; // REPLACE THIS
// var wrap = require('co-monk');
// var monk = require('monk');
// var db = monk(mongo);
// var posts = wrap(db.get('posts'));

// posts.insert({
//   tracker: "post_counter",
//   counter: 0
// })


/**
 * Module dependencies.
 */

var render = require('../lib/render');
var posts = require('../models/posts_model');

/**
 * Define `Routes`.
 */

var Routes = {};

Routes.list = function *list() {
  var listPosts = yield posts.find({ type: "post" });

  this.body = yield render('list', { posts: listPosts });
}

Routes.add = function *add() {
  this.body = yield render('new');
}

Routes.show = function *show(id) {
  var post = yield posts.findOne({ _id: id });
  console.log(post)
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
}

Routes.create = function *create() {
  var post = yield posts.findOne({ tracker: "post_counter" });

  var post_counter = post.counter;

  var newPost = {
    _id: post_counter,
    created_at: new Date,
    updated_on: new Date,
    title: this.request.body.title,
    body: this.request.body.body,
    type: "post"
  }

  yield posts.insert(newPost);

  yield posts.findAndModify({ query: {tracker: "post_counter"}, update: {tracker: "post_counter", counter: post_counter + 1} })

  this.redirect('/');
}

Routes.edit = function *edit(id) {
    var post = yield posts.findOne({ _id: id });
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
