// Generated by CoffeeScript 2.5.1
(function() {
  var indexOf = [].indexOf;

  define(function() {
    return function() {
      return d3.selection.prototype.parents = function(selector) {
        var e, items, klass, p, res;
        res = [];
        p = this.node();
        while (p = p.parentNode) {
          try {
            klass = d3.select(p).attr("class");
          } catch (error) {
            e = error;
          }
          if (!klass) {
            continue;
          }
          items = klass.split(" ");
          if (indexOf.call(items, selector) >= 0) {
            res.push(p);
          }
        }
        return res;
      };
    };
  });

}).call(this);