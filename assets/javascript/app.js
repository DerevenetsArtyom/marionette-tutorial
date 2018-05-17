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


// represents single To-do item
const ToDo = Marionette.LayoutView.extend({
    tagName: "li",
    template: "#todo-item"
});

// represents list of separate items and additional info
const TodoList = Marionette.CompositeView.extend({
    el: "#app-hook",
    template: "#todo-list",

    childView: ToDo,
    childViewContainer: "ul",

    ui: {
        assignee: '#id_assignee',
        form: 'form',
        text: '#id_text'
    },

    // when a jQuery event occurs, we can listen for it and fire a trigger
    triggers: {
        'submit @ui.form': 'add:todo:item'
    },

    // if I do that way, onAddTodoItem will be executed,
    // but page will be reload for some reasons
    // events: {
    //     'submit @ui.form': 'onAddTodoItem'
    // },

    // The 'collectionEvents' allows us to listen to changes
    // occurring on the attached 'this.collection' attribute.
    // The value must exist as a method on this view
    collectionEvents: {
        add: 'itemAdded'
    },

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


const todo = new TodoList({
    collection : new Backbone.Collection([
        {assignee: 'Scott', text: 'Write a book about Marionette'},
        {assignee: 'Andrew', text: 'Do some coding'}
    ]),
    model: new ToDoModel()
});


todo.render();
