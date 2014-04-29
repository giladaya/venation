define(['vec2d', 'auxin', 'node', 'bounds/box'], function(Vec2d, Auxin, Node, Bounds){
  var killRadSq = Node.step*Node.step;
  var infRadSq = Infinity;

  var nodeAdditions = [];
  var deadAuxinIds = [];
  var closestId = -1;
  var distSq;
  var minDistance;

  Venation = {
    allAuxins : [],
    allNodes : [],
    bounds : null, 

    init: function (width, height, auxinsNum) {
      this.width = width;
      this.height = height;
      this.bounds = this.bounds || new Bounds(0, 0, width, height);

      var x, y, key, taken = {};
      //set all positions of auxins
      for (var i = 0; i < auxinsNum; i++) {
        x = Math.round(Math.random()*width);
        y = Math.round(Math.random()*height);
        key = 'x'+Math.floor(x/2/Node.step)+'y'+Math.floor(y/2/Node.step);
        if (key in taken){
          continue;
        }
        this.allAuxins.push(new Auxin(new Vec2d(x, y)));  
        taken[key] = 1;
      }
    },

    step: function () {
      var node, auxin;
      // attributes the nodes with all of their closest auxins
      for (var a = 0; a < this.allAuxins.length; a++) {
        auxin = this.allAuxins[a];
        if (!this.bounds.isInside(auxin.pos)) {
          continue;
        }

        minDistance = this.width*this.width+this.height*this.height;
        closestId = -1;

        //find closest node
        for (var r = 0; r < this.allNodes.length; r++) {
          node = this.allNodes[r];
          distSq = Vec2d.distSq(auxin.pos, node.pos);
          if (distSq > infRadSq){
            continue;
          }

          if (distSq < minDistance) {
            minDistance = distSq;
            closestId = r;
          }

          if (distSq < killRadSq) {
            deadAuxinIds.push(a);
          }
        }

        // add closest auxin to node particles closest list
        if (closestId >= 0) {
          this.allNodes[closestId].closestAuxins.push(auxin);  
        }
      }

      // grow nodes with respect to their closest Auxins
      var newPos;
      for (r = 0; r < this.allNodes.length; r++) {
        node = this.allNodes[r];
        node.age++;
        // if the node particle has at least one auxin to grow towards
        if (node.closestAuxins.length > 0) {
          newPos = node.grow();
          if (newPos != null){
            nodeAdditions.push(new Node(newPos, node));
            node.childCount++;
          }
        }

        // clear nodes auxin list for next iteration
        node.resetClosestAuxins();
      }

      // add the new node particles to the list
      for (r = 0; r < nodeAdditions.length; r++) {
        this.allNodes.push(nodeAdditions[r]);
      }
      nodeAdditions = [];

      // delete used up auxins
      for (a = 0; a < deadAuxinIds.length; a++) {
        this.allAuxins.splice(deadAuxinIds[a]-a, 1);
      }
      deadAuxinIds = [];
    },

    setKillRadius : function (mult) {
      killRadSq = mult*mult*Node.step*Node.step;
    },
    setInfluenceRadius : function (mult) {
      infRadSq = mult*mult*Node.step*Node.step;
    },
    addNode : function (node) {
      this.allNodes.push(node);
    },
    setBounds : function (bounds) {
      this.bounds = bounds;
    }

  };

  return Venation;
});