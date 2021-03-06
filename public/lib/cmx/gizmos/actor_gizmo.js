// Generated by CoffeeScript 2.5.1
(function() {
  define(['cmx/gizmos/entity_gizmo'], function(EntityGizmo) {
    var ActorGizmo;
    return ActorGizmo = class ActorGizmo extends EntityGizmo {
      update() {
        var ref;
        super.update();
        return (ref = this.ΔskeletonGizmo) != null ? ref.selectAll(".cmx-control").attr("cx", function(bone) {
          return bone.x;
        }).attr("cy", function(bone) {
          return bone.y;
        }).style("display", (bone) => {}) : void 0;
      }

      build() {
        var alignBone, base, data, doubleClick, drag, resetBone;
        base = super.build();
        this.ΔskeletonGizmo = base.append("g").attr("class", "cmx-gizmo cmx-actor");
        alignBone = (bone) => {
          var a, b, ud;
          if (bone.name === 'LLEG') {
            ud = this.entity.legs[0];
          }
          if (bone.name === 'RLEG') {
            ud = this.entity.legs[1];
          }
          if (bone.name === 'LARM') {
            ud = this.entity.arms[0];
          }
          if (bone.name === 'RARM') {
            ud = this.entity.arms[1];
          }
          a = this.entity.skelet.bone(ud[0]);
          b = this.entity.skelet.bone(ud[2]);
          bone.x = Math.round((a.x + b.x) / 2);
          bone.y = Math.round((a.y + b.y) / 2);
          return this.entity.update();
        };
        resetBone = (bone) => {
          this.entity.skelet.moveBone(bone.name, 0, 0, true);
          return this.entity.throttledUpdate();
        };
        doubleClick = (bone) => {
          d3.event.preventDefault();
          if (bone.type === "l") {
            return alignBone(bone);
          }
          if (bone.name === 'HNDL') {
            return resetBone(bone);
          }
        };
        drag = d3.behavior.drag().on("dragstart", (bone) => {
          this.controlUndoOpen("pose");
          return this.controlDragStart(bone);
        }).on("dragend", (bone) => {
          this.controlDragEnd(bone);
          return this.controlUndoClose();
        }).on("drag", (bone) => {
          this.entity.skelet.moveBone(bone.name, d3.event.dx, d3.event.dy, false);
          return this.entity.throttledUpdate();
        });
        data = this.entity.skelet.bonesWithIndices(this.entity.actorBones);
        this.ΔskeletonGizmo.selectAll(".cmx-control").data(data).enter().append("circle").attr("class", function(bone) {
          return `cmx-control cmx-${bone.type}`;
        }).attr("r", this.CONTROL_POINT_RADIUS).on("dblclick", doubleClick).call(drag);
        return this.ΔskeletonGizmo;
      }

    };
  });

}).call(this);
