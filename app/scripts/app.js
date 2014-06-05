define(['jquery', 'venation', 'node', 'vec2d', 'bounds/circle', 'terrain'], function ($, Venation, Node, Vec2d, CircBounds, Terrain) {
  'use strict';

  //DOM elements
  var canvas, ctx, dlLink;
  var minAge = 1;
  var terr;
  var tree, root;
  var width = 0;
  var height = 0;
  var tWidth, tHeight, tOffset;
  var groundHeight = 50;
  var numSources;
  var lifeSpan = 80;
  var isLive = true;

  function showError (msg) {
    alert(msg);
    console.log(msg);
  }
  
  var app = {
    init: function () {
      if (!this.checkRequierments()) {
        showError('Your browser is not supported. Please use Chrome, Firefox or IE10 and above');
        return false;
      }
      this.cacheElements();
      this.attachEvents();

      width = canvas.width;
      height = canvas.height;
      tWidth = width*0.9;
      tHeight = height*0.7;
      //groundHeight = tHeight-20;

      canvas.style.width = width+'px';
      canvas.style.height = height+'px';
      ctx.lineCap = 'round';
      //ctx.lineJoin = 'round';
      //ctx.fillStyle = 'rgba(255, 255, 0, 1)';
      
      var sSparsity  = 8.5; //average distance between sources
      numSources = Math.floor(tHeight*tWidth/sSparsity/sSparsity);
      console.log('Using '+numSources+' sources');
      Node.step = 4;

      tree = new Venation(tWidth, tHeight);
      tree.setKillRadius(2);
      tree.setInfluenceRadius(4);

      root = new Venation(tWidth, height - tHeight);
      root.setKillRadius(2);
      root.setInfluenceRadius(4);

      this.resetTree();

      //generate terrain
      terr = Terrain.generate(width, groundHeight, groundHeight/2, 0.6, 1, 0);
      var delta = groundHeight - terr[Math.round(width*0.3)];
      for (var t = 0; t < terr.length; t++) {
        terr[t] = height-terr[t]-delta;
      }
    },

    resetTree : function () {
      tree.reset();
      tree.initSources(numSources, new CircBounds(tWidth*0.2, tHeight, tWidth/2));
      //tree.initSources(numSources);
      tree.addNode(new Node(new Vec2d(tWidth*0.2, tHeight)));

      root.reset();
      root.initSources(numSources, new CircBounds(tWidth*0.2, tHeight/2, tHeight/2));
      root.addNode(new Node(new Vec2d(tWidth*0.2, 0)));

      tOffset = 0.3*(width-tWidth);
      isLive = true;
      minAge = -1;
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

    drawNodeCherry : function (node, cherry) {
      var rad = Math.sqrt(node.flow)+1;
      if (rad < 2) {
        return;
      }
      //rad = Math.max(5, rad);
      //rad = Math.min(8, rad);

      // ctx.arc(node.pos.x, node.pos.y, rad*8, 0, Math.PI * 2);
      // ctx.fillStyle = 'rgba(64, 128, 64, 0.1)';
      // ctx.fill();

      // var tone = Math.max(0, 255-node.flow*5);
      // ctx.strokeStyle = 'rgba('+tone+', '+tone+', '+tone+', 1)';
      ctx.lineWidth = rad;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();

      ctx.lineWidth = rad/3;
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x+rad/3, node.parent.pos.y);
      ctx.lineTo(node.pos.x+rad/3, node.pos.y-rad/4);
      ctx.stroke();

      // ctx.lineWidth = rad/2;
      // ctx.beginPath();
      // ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      // ctx.strokeStyle = 'rgba(128, 0, 0, 1)';
      // ctx.lineTo(node.pos.x, node.pos.y);
      // ctx.stroke();

      //cherries
      if (cherry && node.childCount == 0 && (node.age > 15 && node.age < 45)){
        app.drawCherry(node.parent.pos.x+3,node.parent.pos.y);
      } 
    },

    drawCherry : function (x, y) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      ctx.arc(x, y,3,0,Math.PI*2, false);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(x+1.5, y-1,1,0,Math.PI*2, false);
      ctx.fill();
    }, 

    drawBg : function () {
      var grd=ctx.createLinearGradient(0,0,0,height);
      grd.addColorStop(0,'#d6f1d9');
      grd.addColorStop(1,'#f4f081');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      //sun
      ctx.beginPath();
      //ctx.fillStyle = 'rgba(56, 0, 0, 1)';
      ctx.fillStyle = 'white';
      grd=ctx.createLinearGradient(0,0,0,height);
      grd.addColorStop(0,'white');
      grd.addColorStop(0.25,'white');
      grd.addColorStop(0.5,'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grd;
      ctx.arc(width*0.7,height*0.3,Math.min(width, height)/4,0,Math.PI*2, false);
      ctx.fill();
    }, 

    drawFg : function () {
      //ground
      ctx.fillStyle = 'black';
      // ctx.fillRect(0, height-groundHeight, width, height);
      ctx.beginPath();
      ctx.moveTo(0, terr[0]);
      for (var t = 1; t < width; t++) {
        ctx.lineTo(t, terr[t]);
      }
      // finish creating the rect so we can fill it
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
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
      var oldNodesCount = tree.allNodes.length;
      if (isLive) {
        tree.step();
        root.step();
      }
      var r1;
      if (tree.allNodes.length > 1){
        app.drawBg();
        //ctx.clearRect(0, 0, width, height);
        ctx.save();

        ctx.translate(tOffset, height-tHeight-groundHeight*1.5);
        for (var i=0; i<tree.allNodes.length; i++){
          r1 = tree.allNodes[i];
          if (r1.parent != null && r1.age >= minAge){
            app.drawNodeCherry(r1, true);  
          }
        }

        ctx.translate(0, tHeight);
        for (var i=0; i<root.allNodes.length; i++){
          r1 = root.allNodes[i];
          if (r1.parent != null && r1.age >= minAge){
            app.drawNodeCherry(r1, false);
          }
        }

        ctx.restore();
        app.drawFg();
      }
      if (tree.allAuxins.length > 0 && tree.allNodes.length > oldNodesCount && tree.age<lifeSpan){
        requestAnimationFrame(app.draw);
      } else {
        isLive = false;
        minAge++;
        //requestAnimationFrame(app.draw);
        app.done();
      }
      if (minAge >= lifeSpan){
        app.resetTree();
      }
    },
    done: function () {
      dlLink.setAttribute('href', canvas.toDataURL());
      dlLink.style.visibility = 'visible';
      console.log('root age: '+tree.allNodes[0].age);
    }
  };

  return app;
});
