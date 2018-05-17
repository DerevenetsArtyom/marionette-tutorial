const ToDoModel = Backbone.Model.extend({
    defaults: {
        assignee: '',
        text: ''
    },

    validate: function(attrs) {
        var errors = {};
        var hasError = false;
        if (!attrs.assignee) {
            errors.assignee = 'assignee must be set';
            hasError = true;
        }
        if (!attrs.text) {
            errors.text = 'text must be set';
            hasError = true;
        }

        if (hasError) {
            console.log("errors", errors);
            return errors;
        }
    }
});


/// views/list.js

// represents single To-do item
const TodoItemView = Marionette.LayoutView.extend({
    tagName: "li",
    template: "#todo-item"
});

// represents list of items
const TodoListView = Marionette.CollectionView.extend({
    childView: TodoItemView,
    tagName: "ul"
});


/// views/form.js

const FormView = Marionette.LayoutView.extend({
    tagName: "form",
    template: "#form",

    ui: {
        assignee: '#id_assignee',
        text: '#id_text'
    },

    // when a jQuery event occurs, we can listen for it and fire a trigger
    triggers: {
        submit: 'add:todo:item'
    },

    modelEvents: {
        change: 'render'
    }
});


/// views/layout.js

const Layout = Marionette.LayoutView.extend({
    el: "#app-hook",
    template: "#layout",

    regions: {
        form: ".form",
        list: ".list"
    },

    collectionEvents: {
        add: 'itemAdded'
    },

    onShow: function () {
        const formView = new FormView({model: this.model});
        const listsView = new TodoListView({collection: this.collection});

        this.showChildView("form", formView);
        this.showChildView("list", listsView);
    },

    onChildviewAddTodoItem: function (child) {
        const data = {
            assignee: child.ui.assignee.val(),
            text: child.ui.text.val()
        };
        this.model.set(data);

        if (this.model.isValid()) {
            this.collection.add(this.model.toJSON());
        }
    },

    // The method referenced in collectionEvents is called when the event is triggered
    itemAdded: function () {
        this.model.set({
            assignee: '',
            text: ''
        });
    }
});

const initialData = [
    {assignee: 'Scott', text: 'Write a book about Marionette'},
    {assignee: 'Andrew', text: 'Do some coding'}
];

const app = new Marionette.Application({
    onStart: function (options) {
        const todo = new Layout({
            collection : new Backbone.Collection(options.initialData),
            model: new ToDoModel()
        });
        todo.render();
        todo.triggerMethod('show');
    }
});

app.start({initialData: initialData});
