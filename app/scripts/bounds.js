define(['point2d'], function(Vec2d){

  var Bounds = function(x1, y1, x2, y2){
    var l, r, t, b;
    if (x1 < x2) {
      l = x1;
      r = x2;
    } else {
      l = x2;
      r = x1;
    }

    if (y1 < y2) {
      b = y1;
      t = y2;
    } else {
      b = y2;
      t = y1;
    }
    this.t = t;
    this.b = b;
    this.l = l;
    this.r = r;
  };

  Bounds.prototype = {
    isInside : function (p) {
      return (p.x > this.l && p.x < this.r && p.y > this.b && p.y < this.t);
    }
  };

  return Bounds;
});