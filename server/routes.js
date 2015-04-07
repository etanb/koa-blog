
/**
 * Module dependencies.
 */

var render = require('../lib/render');
var Models = require('../lib/models');

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

Routes.edit = function *edit(id) {
    var post = posts[id];
    if (!post) this.throw(404, 'invalid post id');
    this.body = yield render('edit', { post: post });
}

Routes.update = function *update() {
    var post = yield parse(this);
    var index = post.id;
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
