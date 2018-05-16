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
    childViewContainer: "ul"
});

const todo = new TodoList({
    collection : new Backbone.Collection([
        {assignee: 'Scott', text: 'Write a book about Marionette'},
        {assignee: 'Andrew', text: 'Do some coding'}
    ])
});

todo.render();
