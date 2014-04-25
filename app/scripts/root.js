define(['auxin', 'point2d'], function(Auxin, Vec2d){
  var Root = function(pos){
    this.pos = pos;
    this.radius = 2;
    this.age = 1;
    this.closestAuxins = []
  }

  Root.prototype = {
    grow : function(){
      var towardsAuxins;
      var averageDirection = new Vec2d(0, 0);
      var newPos;

      for (var i = 0; i < this.closestAuxins.length; i++){
        towardsAuxins = Vec2d.sub(this.closestAuxins[i].pos, this.pos);
        averageDirection.add(towardsAuxins);
      }

      averageDirection.normalize();
      averageDirection.mult(this.radius*0.5);

      newPos = Vec2d.add(this.pos, averageDirection);
      this.age++;
      //this.radius++; //TODO: use Murray's law?

      return newPos;
    },

    resetClosestAuxins : function () {
      this.closestAuxins = [];
    }

  };

  return Root;
});