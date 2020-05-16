// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/model', 'cmx/entities/label'], function(Model, Label) {
    var LabelModel;
    return LabelModel = class LabelModel extends Model {
      constructor() {
        super();
        this.defaults = {
          "t": "",
          "pose": "0,-10|0,0",
          "content": '<tspan x="0" y="0em">hello world</tspan>'
        };
        super();
      }

      materialize(parent) {
        var o;
        o = new Label(parent.scene);
        o.setFrame(this.props["t"]);
        o.setPose(this.unserializePose(this.props["pose"]));
        o.setContent(this.props.content);
        parent.add(o);
        return super.materialize(o);
      }

      read() {
        this.props["pose"] = this.serializePose(this.view.getPose());
        return this.props["t"] = this.view.getFrame();
      }

    };
  });

}).call(this);
