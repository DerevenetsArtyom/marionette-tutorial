//////////////
/// models ///
//////////////

const BlogModel = Backbone.Model.extend({
    // Let us inject 0 comments in from the data set
    defaults: function() {
        return {
            comments: []
        }
    }
});

const CommentModel = Backbone.Model.extend();

///////////////////
/// collections ///
///////////////////

const BlogCollection = Backbone.Collection.extend({
    model: BlogModel
});

const CommentCollection = Backbone.Collection.extend({
    model: CommentModel
});

/////////////////////
/// views/list.js ///
/////////////////////

const EntryItemView = Marionette.LayoutView.extend({
    template: "#item",
    tagName: "li",

    triggers: { click: "select:entry" }
});

const BlogListView = Marionette.CollectionView.extend({
    childView: EntryItemView,
    tagName: "ul",

    // should respond on 'select:entry' event inside childView ?
    onChildviewSelectEntry: function (child, options) {
        this.triggerMethod("select:entry", child.model)
    }
});


/////////////////////
/// views/blog.js ///
/////////////////////

const CommentItemView = Marionette.LayoutView.extend({
    tagName: "li",
    template: "#comment"
});

const CommentListView = Marionette.CollectionView.extend({
    tagName: "ol",
    childView: CommentItemView
});

const BlogView = Marionette.LayoutView.extend({
    template: "#blog",

    regions: { comments: ".comment-hook" },

    ui: { back: ".back" },

    triggers: { "click @ui.back": "show:blog:list" },

    onShow: function () {
        const comments = new CommentCollection(this.model.get('comments'));
        const commentsView = new CommentListView({collection: comments});

        this.showChildView('comments', commentsView)
    }
});

///////////////////////
/// views/layout.js ///
///////////////////////

const LayoutView = Marionette.LayoutView.extend({
    template: "#layout",

    regions: {
        layout: ".layout-hook"
    },

    onShowBlogList: function () {
        console.log('LayoutView onShowBlogList');
        const list = new BlogListView({collection: this.collection});
        this.showChildView("layout", list);
        Backbone.history.navigate("blog/");
    },

    onShowBlogEntry: function (entry) {
        console.log('LayoutView onShowBlogEntry');
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
        const blog = new BlogView({model: blogModel});
        this.showChildView('layout', blog);

        Backbone.history.navigate("blog/" + blog.id);
    }
});

/////////////////
/// router.js ///
/////////////////

const Controller = Marionette.Object.extend({
    initialize: function () {
        // The region manager gives us a consistent UI and
        // event triggers across our different layouts.
        this.options.regionManager = new Marionette.RegionManager({
            regions: { main: "#blog-hook" }
        });

        const initailData = this.getOption("initialData");

        const layout = new LayoutView({
            collection: new BlogCollection(initailData.posts)
        });

        this.getOption("regionManager").get("main").show(layout);

        // We want easy access to our root view later
        this.options.layout = layout;
    },

    // List all blog entries with a summary
    blogList: function () {
        console.log('Controller blogList');
        const layout = this.getOption("layout");
        layout.triggerMethod("show:blog:list")
    },

    // List a named entry with its comments underneath
    blogEntry: function(entry) {
        console.log('Controller blogEntry');
        const layout = this.getOption('layout');
        layout.triggerMethod('show:blog:entry', entry);
    }
});

const Router = Marionette.AppRouter.extend({
    appRoutes: {
        'blog/': 'blogList',
        'blog/:entry': 'blogEntry'
    },

    // Initialize our controller with the options
    // passed into the application, such as the initial posts list.
    initialize: function() {
        this.controller = new Controller({
            initialData: this.getOption('initialData')
        })
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
        Backbone.history.start();
    }
});

app.start({initialData: initialData});
