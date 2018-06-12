/// views/list.js

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
    onChildViewSelectEntry: function (child, options) {
        this.triggerMethod("select:entry", child.model)
    }
});


/// views/form.js

/// views/layout.js


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
