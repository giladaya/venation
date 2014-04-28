define(['vec2d'], function(Vec2d){

  var Bounds = function(cx, cy, rad){
    this.center = new vec2d(cx, cy);
    this.rad = rad;
  };

  Bounds.prototype = {
    isInside : function (p) {
      return (Vec2d.distSq(p, this.center) < this.rad*this.rad);
    }
  };

  return Bounds;
});