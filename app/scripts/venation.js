define(['point2d', 'auxin', 'root'], function(Vec2d, Auxin, Root){
  var deathRadSq = 10 * 10;

  var rootAdditions = [];
  var deadAuxinIds = [];
  var closestId = -1;
  var distSq;
  var minDistance;

  Venation = {
    allAuxins : [],
    allRoots : [],

    init: function (width, height, roots, auxinsNum) {
      this.width = width;
      this.height = height;

      //set all positions of auxins
      //TODO: should use dart-throwing
      for (var i = 0; i < auxinsNum; i++) {
        this.allAuxins.push(new Auxin(new Vec2d(Math.random()*width, Math.random()*height)));
      }

      for (i = 0; i < roots.length; i++) {
        this.allRoots.push(roots[i]);  
      }
    },

    step: function () {
      // attributes the roots with all of their closest auxins
      for (var a = 0; a < this.allAuxins.length; a++) {

        minDistance = this.width*this.width+this.height*this.height;
        closestId = -1;

        //find closest root
        for (var r = 0; r < this.allRoots.length; r++) {
          distSq = Vec2d.distSq(this.allAuxins[a].pos, this.allRoots[r].pos);

          if (distSq < minDistance) {
            minDistance = distSq;
            closestId = r;
            // if (this.allAuxins.length == 2){
            //   console.log(minDistance);  
            // }
          }

          if (distSq < deathRadSq) {
            deadAuxinIds.push(a);
          }
        }

        // add closest auxin to root particles closest list
        this.allRoots[closestId].closestAuxins.push(this.allAuxins[a]);
      }

      // grow roots with respect to their closest Auxins
      var root, newPos;
      for (r = 0; r < this.allRoots.length; r++) {
        root = this.allRoots[r];
        root.age++;
        // if the root particle has at least one auxin to grow towards
        if (root.closestAuxins.length > 0) {
          newPos = root.grow();
          rootAdditions.push(new Root(newPos));
        }

        // clear roots auxin list for next iteration
        root.resetClosestAuxins();
      }

      // add the new root particles to the list
      for (r = 0; r < rootAdditions.length; r++) {
        this.allRoots.push(rootAdditions[r]);
      }
      rootAdditions = [];

      // delete used up auxins
      for (a = 0; a < deadAuxinIds.length; a++) {
        this.allAuxins.splice(deadAuxinIds[a]-a, 1);
      }
      deadAuxinIds = [];
    },
    setDeathRadius : function (rad) {
      deathRadSq = rad*rad;  
    }

  };

  return Venation;
});