/////////////////////
/// views/list.js ///
/////////////////////

// represents single blog item
const Entry = Marionette.LayoutView.extend({
    template: "#item",
    tagName: "li",

    triggers: {
      click: "select:entry"
    }
});

// represents list of items
const BlogList = Marionette.CollectionView.extend({
    childView: Entry,
    tagName: "ul",

    // todo: what a hell?
    onChildviewSelectEntry: function (child, options) {
        this.triggerMethod("select:entry", child.model)
    }
});


/////////////////////
/// views/blog.js ///
/////////////////////

const Comment = Marionette.LayoutView.extend({
    tagName: "li",
    template: "#comment"
});


const CommentListView = Marionette.CollectionView.extend({
    tagName: "ol",
    childView: Comment
});


const Blog = Marionette.LayoutView.extend({
    template: "#blog",

    regions: {
        comments: "#comment-hook"
    },

    ui: {
        back: ".back"
    },

    triggers: {
        "click @ui.back": "show:blog:list"
    },

    onShow: function () {
        // TODO wtf?
        const comments = new CommentList(this.model.get('comments'));
        const commentsView = new CommentListView({collection: comments});

        this.showChildView('comments', commentsView)
    }
});

// На книжной полке стоят два тома Пушкина, первый и второй.
// Толщина страниц каждого тома — 2 см, а каждой обложки — 2 мм.
// Книжный червь сидел на первой странице первого тома и прогрыз (по кратчайшему пути) до последней страницы второго.
// Какое расстояние он прогрыз?


///////////////////////
/// views/layout.js ///
///////////////////////

const LayoutView = Marionette.LayoutView.extend({
    template: "#layout",

    regions: {
        layout: ".layout-hook"
    },

    onShowBlogList: function () {
        const list = BlogList({collection: this.collection});
        this.showChildView("layout", list);

        /*
        Remember - this only sets the fragment,
        so we can safely call this as
        often as we like with no negative side-effects.
        */

        Backbone.history.navigate("blog/");
    },
    
    onShowBlogEntry: function (entry) {
        const model = this.collection.get(entry);
        this.showBlog(model);
    },

    onChildviewSelectEntry: function (child, model) {
        this.showBlog(model);
    },

    // Child-initiated alias to onShowBlogList
    onChildviewShowBlogList: function () {
        this.triggerMethod("show:blog:list");
    },

    // Share some simple logic from our subviews
    showBlog: function (blogModel) {
        const blog = new Blog({model: blogModel});
        this.showChildView('layout', blog);

        Backbone.history.navigate("blog/" + blog.id);
    }
});


/// driver.js - entrypoint for whole application

const initialData = {
  posts: [
    {
      author: 'Scott',
      title: 'Why Marionette is amazing',
      content: '...',
      id: 42,
      comments: [
        {
          author: 'Steve',
          content: '...',
          id: 56
        }
      ]
    },
    {
      author: 'Andrew',
      title: 'How to use Routers',
      content: '...',
      id: 17
    }
  ]
};

const app = new Marionette.Application({
    onStart: function (options) {
        const router = new Router(options);

        /** Starts the URL handling framework */
        Backbone.history.start();
    }
});

app.start({initialData: initialData});
