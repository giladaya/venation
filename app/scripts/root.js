define(['auxin', 'point2d'], function(Auxin, Vec2d){
  var Root = function(pos, parent){
    this.pos = pos;
    this.parent = parent;
    this.age = 1;
    this.flow = 1;
    this.closestAuxins = []
  }

  Root.radius = 2;

  Root.prototype = {
    grow : function(){
      var towardsAuxins;
      var averageDirection = new Vec2d(0, 0);
      var newPos;

      for (var i = 0; i < this.closestAuxins.length; i++){
        towardsAuxins = Vec2d.sub(this.closestAuxins[i].pos, this.pos);
        averageDirection.add(towardsAuxins);
      }
      var mag = averageDirection.mag();

      newPos = new Vec2d(averageDirection.x, averageDirection.y);
      newPos.normalize();
      newPos.mult(Root.radius);
      if (newPos.mag() > averageDirection.mag()) {
        newPos = averageDirection;
      }

      newPos.add(this.pos);
      this.age++;

      //update flow counts
      var ancestor = this.parent;
      while (ancestor != null){
        ancestor.flow++;
        ancestor = ancestor.parent;
      }

      return newPos;
    },

    resetClosestAuxins : function () {
      this.closestAuxins = [];
    }

  };

  return Root;
});