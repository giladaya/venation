define(['jquery', 'venation', 'root', 'point2d'], function ($, Venation, Root, Vec2d) {
  'use strict';

  var canvas, ctx;

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
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      //ctx.fillStyle = 'rgba(255, 255, 0, 1)';
      
      var initRoots = [];
      initRoots.push(new Root(new Vec2d(canvas.width/2, canvas.height/2)));
      //initRoots.push(new Root(new Vec2d(0, 0)));
      //initRoots.push(new Root(new Vec2d(canvas.width, canvas.height)));
      Venation.init(canvas.width, canvas.height, initRoots, 1000);
      Venation.setDeathRadius(8);
    },
    
    checkRequierments: function () {
      return (window.FormData && window.localStorage);
    }, 

    cacheElements: function () {
      canvas = document.getElementsByTagName('canvas')[0];
      ctx = canvas.getContext("2d");
    },

    attachEvents: function () {
    },

    run : function () {
      requestAnimationFrame(this.draw);
    },

    drawNode : function (node) {
      var rad = 0.25 + 0.01*node.flow;
      //rectangles
      //ctx.fillRect(node.pos.x, node.pos.y, rad, rad);

      //circles
      // ctx.beginPath();
      // ctx.arc(node.pos.x, node.pos.y, rad, 0, Math.PI*2); 
      // ctx.closePath();
      // ctx.fill();

      //lines
      var tone = Math.max(0, 255-rad*100);
      ctx.strokeStyle = 'rgba('+tone+', '+tone+', '+tone+', 1)';
      ctx.lineWidth = rad;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();  
    },

    draw : function() {
      var oldRootsCount = Venation.allRoots.length;
      Venation.step();
      var r1, r2;
      r2 = Venation.allRoots[0];
      if (Venation.allRoots.length > 1){
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.heoght);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        for (var i=0; i<Venation.allRoots.length; i++){
          r1 = Venation.allRoots[i];
          if (r1.parent != null){
            app.drawNode(r1);  
          }
        }
      }
      if (Venation.allAuxins.length > 0 && Venation.allRoots.length > oldRootsCount){
        requestAnimationFrame(app.draw);
      }
    }
  };

  return app;
});
