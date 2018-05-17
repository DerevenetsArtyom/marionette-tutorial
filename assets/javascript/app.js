/// models

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

// represents list of separate items and additional info
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

    // The 'collectionEvents' allows us to listen to changes
    // occurring on the attached 'this.collection' attribute.
    // The value must exist as a method on this view
    // collectionEvents: {
    //     add: 'itemAdded'
    // },

    modelEvents: {
        change: 'render'
    }
});




    // This trigger is then converted to an 'onEventName' method and called.
    // This method need not exist and is very powerful.
    onAddTodoItem: function () {
        const data = {
            assignee: this.ui.assignee.val(),
            text: this.ui.text.val()
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

        this.ui.assignee.val('');
        this.ui.text.val('');
    }
});

const initialData = [
    {assignee: 'Scott', text: 'Write a book about Marionette'},
    {assignee: 'Andrew', text: 'Do some coding'}
];

const app = new Marionette.Application({
    onStart: function (options) {
        const todo = new TodoListView({
            collection : new Backbone.Collection(options.initialData),
            model: new ToDoModel()
        });
        todo.render();
        todo.triggerMethod('show');
    }
});

app.start({initialData: initialData});
