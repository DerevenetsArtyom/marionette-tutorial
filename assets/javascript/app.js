const ToDo = Marionette.LayoutView.extend({
    tagName: "li",
    template: "#todo-item"
});

const TodoList = Marionette.CollectionView.extend({
    el: "#app-hook",
    tagName:"ul",

    childView: ToDo
});



const todo = new TodoList({
    collection : new Backbone.Collection([
        {assignee: 'Scott', text: 'Write a book about Marionette'},
        {assignee: 'Andrew', text: 'Do some coding'}
    ])
});

todo.render();
