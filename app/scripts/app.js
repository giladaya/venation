define(['jquery', 'venation', 'node', 'vec2d', 'bounds'], function ($, Venation, Node, Vec2d, Bounds) {
  'use strict';

  //DOM elements
  var canvas, ctx, dlLink;

  function showError (msg) {
    alert(msg);
    console.log(msg);
  }
  
  var app = {
    init: function () {
      console.log('Hello!');
      if (!this.checkRequierments()) {
        showError('Your browser is not supported. Please use Chrome, Firefox or IE10 and above');
        return false;
      }
      this.cacheElements();
      this.attachEvents();

      canvas.style.width = canvas.width+'px';
      canvas.style.height = canvas.height+'px';
      ctx.lineCap = 'round';
      //ctx.lineJoin = 'round';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      //ctx.fillStyle = 'rgba(255, 255, 0, 1)';
      
      Node.step = 3;
      Venation.init(canvas.width, canvas.height, 2000);
      Venation.addNode(new Node(new Vec2d(canvas.width/2, canvas.height/2)));
      //Venation.addNode(new Node(new Vec2d(0, 0)));
      //Venation.bounds.l = 40;
      //Venation.bounds.r = 20;
      //Venation.bounds.b = 40;
      //Venation.bounds.t = canvas.height - 40;
      Venation.setKillRadius(2);
      Venation.setInfluenceRadius(7);
    },
    
    checkRequierments: function () {
      return (window.FormData && window.localStorage);
    }, 

    cacheElements: function () {
      canvas = document.getElementsByTagName('canvas')[0];
      ctx = canvas.getContext("2d");
      dlLink = document.getElementById('dl-link');
    },

    attachEvents: function () {
    },

    run : function () {
      requestAnimationFrame(this.draw);
    },

    drawNode : function (node) {
      var rad = 0.25 + 0.5*Math.sqrt(node.flow);
      //if (rad < 1.2) return;
      //rad = Math.max(4, rad);

      // var tone = Math.max(0, 255-node.flow*5);
      // ctx.strokeStyle = 'rgba('+tone+', '+tone+', '+tone+', 1)';
      ctx.lineWidth = rad;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();
      //console.log('line from '+node.parent.pos.x+','+ node.parent.pos.y+' to '+node.pos.x+', '+node.pos.y);
    },

    draw : function() {
      var oldNodesCount = Venation.allNodes.length;
      Venation.step();
      var r1;
      if (Venation.allNodes.length > 1){
        // ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i=0; i<Venation.allNodes.length; i++){
          r1 = Venation.allNodes[i];
          if (r1.parent != null){
            app.drawNode(r1);  
          }
        }
      }
      //Venation.bounds.l -= 2;
      // Venation.bounds.r += 2;
      // Venation.bounds.b -= 1;
      // Venation.bounds.t += 1;
      // ctx.strokeRect(Venation.bounds.l, Venation.bounds.b, (Venation.bounds.r - Venation.bounds.l), (Venation.bounds.t - Venation.bounds.b));
      if (Venation.allAuxins.length > 0 && Venation.allNodes.length > oldNodesCount){
        requestAnimationFrame(app.draw);
      } else {
        app.done();
      }
    },
    done: function () {
      dlLink.setAttribute('href', canvas.toDataURL());
      dlLink.style.visibility = 'visible';
    }
  };

  return app;
});
