// Generated by CoffeeScript 2.5.1
(function() {
  define(function() {
    var View;
    return View = class View {
      constructor(scene) {
        this.scene = scene;
        this.subviews = [];
      }

      add(view) {
        view.parentView = this;
        this.subviews.push(view);
        return view;
      }

    };
  });

}).call(this);