// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/entity', 'cmx/gizmos/label_gizmo'], function(Entity, LabelGizmo) {
    var Label;
    return Label = class Label extends Entity {
      constructor(scene, content) {
        super(scene);
        this.labelBones = this.skelet.addBones([
          [
            'HNDL',
            0,
            0,
            "h" // handle
          ],
          [
            'TEXT',
            -60,
            0,
            "t" // text origin
          ]
        ]);
        this.skelet.addStructure({
          'HNDL': ['TEXT']
        });
        this.setContent(content);
      }

      buildGizmo(root) {
        return this.gizmo = new LabelGizmo(this, root);
      }

      setPose(pose) {
        return this.skelet.setPose(pose, this.labelBones);
      }

      getPose() {
        return this.skelet.getPose(this.labelBones);
      }

      setContent(content1) {
        this.content = content1;
      }

      drawText() {
        var f;
        f = (bone) => {
          return ` ${bone.x},${bone.y}`;
        };
        this.register(this.scene.renderer.openGroup({
          t: (() => {
            return `translate (${f(this.skelet.bone('TEXT'))})`;
          })
        }));
        this.register(this.scene.renderer.text(this.content, {
          border: true
        }));
        return this.register(this.scene.renderer.closeGroup());
      }

      drawLayer(layer) {
        super.drawLayer();
        if (layer === 0) { // draw in non-zoomable layer on top frame
          return this.drawText();
        }
      }

    };
  });

}).call(this);