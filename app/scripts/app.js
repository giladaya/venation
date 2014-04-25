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

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      //ctx.fillStyle = 'rgba(255, 255, 0, 1)';
      
      var initRoots = [];
      initRoots.push(new Root(new Vec2d(canvas.width/2, canvas.height/2)));
      //initRoots.push(new Root(new Vec2d(0, 0)));
      //initRoots.push(new Root(new Vec2d(canvas.width, canvas.height)));
      Venation.init(canvas.width, canvas.height, initRoots, 500);
      Venation.setDeathRadius(5);
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
      var rad = 1 + 0.01*node.age;
      //ctx.fillRect(node.pos.x, node.pos.y, rad, rad);
      ctx.beginPath();
      ctx.arc(node.pos.x, node.pos.y, rad, 0, Math.PI*2); 
      ctx.closePath();
      ctx.fill();
      // ctx.lineWidth = r1.radius;
      // ctx.beginPath();
      // ctx.moveTo(r1.pos.x, r1.pos.y);
      // ctx.lineTo(r2.pos.x, r2.pos.y);
      // ctx.stroke();  
    },

    draw : function() {
      var oldRootsCount = Venation.allRoots.length;
      Venation.step();
      var r1, r2;
      r2 = Venation.allRoots[0]
      if (Venation.allRoots.length > 1){
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.heoght);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        for (var i=1; i<Venation.allRoots.length; i++){
          r1 = r2;
          r2 = Venation.allRoots[i];
          app.drawNode(r1);
        }
      }
      if (Venation.allAuxins.length > 0 && Venation.allRoots.length > oldRootsCount){
        requestAnimationFrame(app.draw);
      }
    }
  };

  return app;
});
