define(function () {
  vec2d = function (x, y){
    this.x = x || 0;
    this.y = y || 0;
  };

  vec2d.sub = function (p1, p2) {
    return new vec2d(p1.x-p2.x, p1.y-p2.y);
  };
  vec2d.add = function (p1, p2) {
    return new vec2d(p1.x+p2.x, p1.y+p2.y);
  };

  vec2d.dist = function (p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  vec2d.distSq = function (p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return (dx * dx + dy * dy);
  };

  vec2d.prototype = {
    mag: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    sub : function(v) {
      this.x -= v.x;
      this.y -= v.y;
    },
    add : function(v) {
      this.x += v.x;
      this.y += v.y;
    },
    mult: function(v) {
      if (typeof v === 'number') {
        this.x *= v;
        this.y *= v;
      } else {
        this.x *= v.x;
        this.y *= v.y;
      }
    },
    div: function(v) {
      if (typeof v === 'number') {
        this.x /= v;
        this.y /= v;
      } else {
        this.x /= v.x;
        this.y /= v.y;
      }
    },
    normalize: function() {
      var m = this.mag();
      if (m > 0) {
        this.div(m);
      }
    },
  };

  return vec2d;
});