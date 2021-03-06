// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/view'], function(View) {
    var Drawable;
    return Drawable = (function() {
      class Drawable extends View {
        constructor(scene) {
          super(scene);
          this.renderCalls = [];
        }

        register(renderCall) {
          this.renderCalls.push(renderCall);
          return renderCall;
        }

        draw(layer) {
          var i, len1, ref, view;
          if (typeof this.openLayer === "function") {
            this.openLayer(layer);
          }
          if (typeof this.drawLayer === "function") {
            this.drawLayer(layer);
          }
          ref = this.subviews;
          for (i = 0, len1 = ref.length; i < len1; i++) {
            view = ref[i];
            view.draw(layer);
          }
          return typeof this.closeLayer === "function" ? this.closeLayer(layer) : void 0;
        }

        prepareFrame(framePos, frameRot) {
          var angle, f, frame, len, r, vecAngle, vx, vy;
          r = function(num) {
            return Math.round(num);
          };
          f = function(p) {
            return `${r(p.x)},${r(p.y)}`;
          };
          frame = [];
          if (framePos) {
            frame.push(`translate(${f(framePos)})`);
          }
          if (frameRot && framePos) {
            // point framePos defines position
            // vector framePos -> frameRot defines rotation
            vecAngle = function(x, y) {
              var angle, dot, len, rad;
              len = Math.sqrt(x * x + y * y);
              dot = x / len;
              rad = Math.acos(dot);
              angle = rad * (360 / (2 * Math.PI)) - 90;
              if (y < 0) {
                angle = 180 - angle;
              }
              return [angle, len];
            };
            vx = frameRot.x - framePos.x;
            vy = frameRot.y - framePos.y;
            [angle, len] = vecAngle(vx, vy);
            frame.push(`rotate(${r(angle)})`);
          }
          return frame.join("");
        }

        openFrame(frame, opts = {}) {
          opts["t"] = frame;
          return this.register(this.scene.renderer.openGroup(opts));
        }

        closeFrame() {
          return this.scene.renderer.closeGroup();
        }

        buildGizmo(root) {
          return {
            leafGizmo: root
          };
        }

        buildGizmos(root) {
          var i, len1, newRoot, ref, results, view;
          newRoot = typeof this.buildGizmo === "function" ? this.buildGizmo(root) : void 0;
          ref = this.subviews;
          results = [];
          for (i = 0, len1 = ref.length; i < len1; i++) {
            view = ref[i];
            if (typeof view.buildGizmos === "function") {
              view.buildGizmos(newRoot.leafGizmo);
            }
            results.push(view.gizmo.update());
          }
          return results;
        }

        update() {
          var call, i, len1, ref, ref1;
          if ((ref = this.gizmo) != null) {
            ref.update();
          }
          ref1 = this.renderCalls;
          for (i = 0, len1 = ref1.length; i < len1; i++) {
            call = ref1[i];
            call.update();
          }
          this.updateDependants();
          this.scene.announceUpdate();
          return this;
        }

        updateDependants() {
          var i, len1, ref, view;
          ref = this.subviews;
          for (i = 0, len1 = ref.length; i < len1; i++) {
            view = ref[i];
            view.update();
          }
          return this;
        }

      };

      Drawable.prototype.throttledUpdate = _.throttle(Drawable.prototype.update, 50);

      return Drawable;

    }).call(this);
  });

}).call(this);
