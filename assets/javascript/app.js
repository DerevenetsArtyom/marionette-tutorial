const Hello = Marionette.LayoutView.extend({
    el: "#app-hook",
    template: "#layout"
});

const hello = new Hello();

hello.render();
