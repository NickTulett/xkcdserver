// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/model', 'cmx/scene'], function(Model, Scene) {
    var SceneModel;
    return SceneModel = class SceneModel extends Model {
      constructor() {
        var defaults;
        defaults = {
          "width": [250, "int"],
          "height": [350, "int"],
          "frame": [true, "bool"],
          "margin-x": [10, "int"],
          "margin-y": [20, "int"]
        };
        super(defaults);
        this.defaults = defaults;
      }

      applyDefaults(props) {
        super.applyDefaults();
        if (props["margin"] !== void 0) {
          props["margin-x"] = props["margin"];
          props["margin-y"] = props["margin"];
        }
        return props;
      }

      materialize($where) {
        var $wrapper, id, scene;
        $wrapper = $("<div/>").attr('class', 'cmx-scene');
        id = $(this.source).attr("id");
        if (id) {
          $wrapper.addClass(`cmx-user-${id}`);
        }
        $where.after($wrapper);
        scene = new Scene(this.cmx, $wrapper.get(0), this.props["width"], this.props["height"], this.props["frame"], this.props["margin-x"], this.props["margin-y"]);
        super.materialize(scene);
        scene.drawScene();
        return scene;
      }

    };
  });

}).call(this);
