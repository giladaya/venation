define(['jquery', 'venation', 'node', 'vec2d', 'bounds/circle'], function ($, Venation, Node, Vec2d, CircBounds) {
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
      
      var sSparsity  = 11; //average distance between sources
      var numSources = Math.floor(canvas.width*canvas.width/sSparsity/sSparsity);
      console.log('Using '+numSources+' sources');
      Node.step = 4;
      Venation.init(canvas.width, canvas.height, numSources);
      //Venation.addNode(new Node(new Vec2d(0, canvas.height)));
      Venation.addNode(new Node(new Vec2d(canvas.width/3, canvas.height)));
      //Venation.addNode(new Node(new Vec2d(0, 0)));
      Venation.setBounds(new CircBounds(canvas.width/2-20, canvas.height/2+40, Math.min(canvas.width, canvas.height)/2));
      // Venation.bounds.l = 25;
      // Venation.bounds.r = canvas.width - 25;
      // Venation.bounds.b = 40;
      //Venation.bounds.t = canvas.height - 5;
      Venation.setKillRadius(2);
      Venation.setInfluenceRadius(4);
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

    drawNodeCherry : function (node) {
      var rad = Math.sqrt(node.flow);
      //if (rad < 2) return;
      //rad = Math.max(5, rad);
      //rad = Math.min(8, rad);

      // var tone = Math.max(0, 255-node.flow*5);
      // ctx.strokeStyle = 'rgba('+tone+', '+tone+', '+tone+', 1)';
      ctx.lineWidth = rad;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();

      ctx.lineWidth = rad/3;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x-rad/3, node.parent.pos.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineTo(node.pos.x-rad/3, node.pos.y-rad/4);
      ctx.stroke();

      ctx.lineWidth = rad/2;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.strokeStyle = 'rgba(128, 0, 0, 1)';
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();

      //cherries
      if (node.childCount == 0 && node.age < 70){
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 1)';
        ctx.arc(node.pos.x,node.pos.y,3,0,Math.PI*2, false);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.arc(node.pos.x-1,node.pos.y,1,0,Math.PI*2, false);
        ctx.fill();
      }
      //console.log('line from '+node.parent.pos.x+','+ node.parent.pos.y+' to '+node.pos.x+', '+node.pos.y);
    },

    drawNodeStd : function (node) {
      var rad = Math.sqrt(node.flow);
      //if (rad < 2) return;
      //rad = Math.max(5, rad);
      //rad = Math.min(8, rad);

      // var tone = Math.max(0, 255-node.flow*5);
      // ctx.strokeStyle = 'rgba('+tone+', '+tone+', '+tone+', 1)';
      ctx.lineWidth = rad;
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();

      //cherries
      // if (node.childCount == 0 && node.age < 70){
      //   ctx.beginPath();
      //   ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      //   ctx.arc(node.pos.x,node.pos.y,3,0,Math.PI*2, false);
      //   ctx.fill();
      // }
      //console.log('line from '+node.parent.pos.x+','+ node.parent.pos.y+' to '+node.pos.x+', '+node.pos.y);
    },

    draw : function() {
      var oldNodesCount = Venation.allNodes.length;
      Venation.step();
      var r1;
      if (Venation.allNodes.length > 1){
        var grd=ctx.createLinearGradient(0,0,0,canvas.height);
        grd.addColorStop(0,'#d6f1d9');
        grd.addColorStop(1,'#f4f081');
        ctx.fillStyle = grd;
        //ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //sun
        ctx.beginPath();
        ctx.fillStyle = 'rgba(56, 0, 0, 1)';
        ctx.arc(canvas.width/2,canvas.height*0.3,Math.min(canvas.width, canvas.height)/3,0,Math.PI*2, false);
        ctx.fill();

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        //for (var i=0; i<Venation.allNodes.length; i++){
        for (var i=0; i<Venation.allNodes.length; i++){
          r1 = Venation.allNodes[i];
          if (r1.parent != null){
            app.drawNodeCherry(r1);  
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
