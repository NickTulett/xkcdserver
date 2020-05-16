// Generated by CoffeeScript 2.5.1
(function() {
  define(function() {
    var Overlay;
    return Overlay = class Overlay {
      constructor(root, width, height, marginX, marginY, extensionX = 400, extensionY = 400) {
        var fullHeight, fullWidth;
        this.width = width;
        this.height = height;
        this.marginX = marginX;
        this.marginY = marginY;
        this.extensionX = extensionX;
        this.extensionY = extensionY;
        fullWidth = this.width + 2 * this.marginX;
        fullHeight = this.height + 2 * this.marginY;
        this.Δsvg = d3.select(root).append("svg").attr("class", "cmx-overlay").style("left", -this.extensionX).style("top", -this.extensionY);
        this.Δsvg.attr("width", fullWidth + 2 * this.extensionX).attr("height", fullHeight + 2 * this.extensionY); // svg canvas
        this.Δdefs = this.Δsvg.append("svg:defs");
        this.Δel = this.Δsvg.append("g").attr("transform", "translate(" + (this.marginX + this.extensionX) + ", " + (this.marginY + this.extensionY) + ")").append("g").attr("transform", "translate(0, " + this.height + ") scale(1, -1)"); // implement margin // flip y
        this.Δgizmos = this.Δel.append("g").attr("class", "cmx-gizmos");
        this.renderArrowDefs();
      }

      renderArrowDefs() {
        this.Δdefs.append("svg:marker").attr("id", "cmx-end-marker-arrow").attr("class", "cmx-marker-arrow").attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("cmx-markerUnits", "strokeWidth").attr("cmx-markerWidth", 3).attr("cmx-markerHeight", 3).attr("orient", "auto").append("svg:path").attr("d", "M 0 0 L 10 5 L 0 10 z");
        return this.Δdefs.append("svg:marker").attr("id", "cmx-start-marker-arrow").attr("class", "cmx-marker-arrow").attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("cmx-markerUnits", "strokeWidth").attr("cmx-markerWidth", 3).attr("cmx-markerHeight", 3).attr("orient", "auto").append("svg:path").attr("d", "M 10 0 L 0 5 L 10 10 z");
      }

    };
  });

}).call(this);
