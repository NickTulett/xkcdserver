// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/gizmo'], function(Gizmo) {
    var EntityGizmo, MARKER_POS, MARKER_ROT, MARKER_SQ, MARKER_SX, MARKER_SY;
    MARKER_POS = 0;
    MARKER_ROT = 1;
    MARKER_SX = 2;
    MARKER_SY = 3;
    MARKER_SQ = 4;
    return EntityGizmo = class EntityGizmo extends Gizmo {
      constructor() {
        super();
        this.entityMarkers = [
          {
            kind: "pos",
            val: [0,
          0]
          },
          {
            kind: "rot",
            val: 0
          },
          {
            kind: "sx",
            val: 1
          },
          {
            kind: "sy",
            val: 1
          },
          {
            kind: "sq",
            val: 0
          }
        ];
        super();
      }

      markerPosition(marker) {
        switch (marker.kind) {
          case "pos":
            return {
              x: 0,
              y: 0
            };
          case "rot":
            return {
              x: 15,
              y: 15
            };
          case "sx":
            return {
              x: 10,
              y: 0
            };
          case "sy":
            return {
              x: 0,
              y: 10
            };
          case "sq":
            return {
              x: marker.val,
              y: -10
            };
          default:
            throw "unknown marker";
        }
      }

      decomposeFrame(frame) {
        var t;
        t = d3.transform(frame);
        this.entityMarkers[MARKER_POS].val[0] = t.translate[0];
        this.entityMarkers[MARKER_POS].val[1] = t.translate[1];
        this.entityMarkers[MARKER_ROT].val = t.rotate;
        this.entityMarkers[MARKER_SX].val = t.scale[0];
        this.entityMarkers[MARKER_SY].val = t.scale[1];
        return this.entityMarkers[MARKER_SQ].val = t.skew;
      }

      composeFrame() {
        var round, t;
        round = function(v, p = 1) {
          return Math.round(v * p) / p;
        };
        t = d3.transform();
        t.translate[0] = round(this.entityMarkers[MARKER_POS].val[0]);
        t.translate[1] = round(this.entityMarkers[MARKER_POS].val[1]);
        t.rotate = round(this.entityMarkers[MARKER_ROT].val);
        t.scale[0] = round(this.entityMarkers[MARKER_SX].val, 100);
        t.scale[1] = round(this.entityMarkers[MARKER_SY].val, 100);
        t.skew = round(this.entityMarkers[MARKER_SQ].val);
        return t.toString();
      }

      update() {
        var ref;
        if ((ref = this.ΔentityGizmo) != null) {
          ref.attr("transform", this.entity.getEffectiveFrame()).selectAll(".cmx-marker").attr("transform", (marker) => {
            var pos;
            pos = this.markerPosition(marker);
            return `translate(${pos.x},${pos.y})`;
          });
        }
        return this;
      }

      build(root) {
        var base, doubleClick, drag, renderMarker, selection;
        base = super.build();
        this.ΔentityGizmo = base.append("g").attr("class", "cmx-gizmo cmx-entity");
        doubleClick = (marker) => {
          d3.event.preventDefault();
          switch (marker.kind) {
            case "pos":
              marker.val = [0, 0];
              break;
            case "rot":
              marker.val = 0;
              break;
            case "sx":
              marker.val = 1;
              break;
            case "sy":
              marker.val = 1;
              break;
            case "sq":
              marker.val = 0;
          }
          this.entity.setFrame(this.composeFrame());
          return this.entity.throttledUpdate();
        };
        drag = d3.behavior.drag().base((target) => {
          return target.parentNode.parentNode;
        }).on("dragstart", (bone) => {
          this.controlUndoOpen("frame");
          return this.controlDragStart(bone);
        }).on("dragend", (bone) => {
          this.controlDragEnd(bone);
          return this.controlUndoClose();
        }).on("drag", (marker) => {
          this.decomposeFrame(this.entity.getFrame());
          switch (marker.kind) {
            case "pos":
              marker.val[0] += d3.event.dx;
              marker.val[1] += d3.event.dy;
              break;
            case "rot":
              marker.val += d3.event.dx + d3.event.dy;
              break;
            case "sx":
              marker.val += d3.event.dx * 0.1;
              break;
            case "sy":
              marker.val += d3.event.dy * 0.1;
              break;
            case "sq":
              marker.val += d3.event.dx;
          }
          this.entity.setFrame(this.composeFrame());
          return this.entity.throttledUpdate();
        });
        renderMarker = function(marker) {
          var appendLine, appendRect, Δ;
          Δ = d3.select(this);
          appendRect = function(Δ, x, y, w, h) {
            return Δ.append("rect").attr("x", x).attr("y", y).attr("width", w).attr("height", h);
          };
          appendLine = function(Δ, x1, y1, x2, y2) {
            return Δ.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
          };
          if (marker.kind !== "rot") {
            appendRect(Δ, -5, -5, 10, 10);
          }
          switch (marker.kind) {
            case "pos": // draw cross
              appendLine(Δ, -5, 0, 5, 0);
              return appendLine(Δ, 0, -5, 0, 5);
            case "rot": // draw arc with double arrows
              appendRect(Δ, -10, -10, 15, 15);
              return Δ.append("path").attr("transform", "translate(-8, -8)").attr("d", "M0,10 A10 10,0,0,0,10 0");
            case "sx": // draw line with arrow
              return appendLine(Δ, -5, 0, 5, 0);
            case "sy": // draw line with arrow
              return appendLine(Δ, 0, -5, 0, 5);
            case "sq": // draw line with double arrows
              return appendLine(Δ, -5, 0, 5, 0);
          }
        };
        selection = this.ΔentityGizmo.selectAll(".cmx-marker").data(this.entityMarkers).enter().append("g").attr("class", function(marker) {
          return `cmx-control cmx-marker cmx-${marker.kind}`;
        }).on("dblclick", doubleClick).call(drag);
        selection.each(renderMarker);
        return this.ΔentityGizmo;
      }

    };
  });

}).call(this);
