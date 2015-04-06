
/**
 * Module dependencies.
 */

var render = require('../lib/render');
var Models = require('../lib/models');
var Tweet = require('./tweet');

// Database

var posts = [];

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
  var post = {
  	title: this.request.body.title,
  	body: this.request.body.body
  }
  var id = posts.push(post) - 1;
  post.created_at = new Date;
  post.id = id;
  this.redirect('/');
}

/**
 * Expose `Routes`.
 */

module.exports = Routes;
