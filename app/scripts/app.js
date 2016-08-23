define(['venation', 'node', 'vec2d', 'bounds/circle', 'terrain'], function (Venation, Node, Vec2d, CircBounds, Terrain) {
  'use strict';

  //DOM elements
  var canvas, ctx, dlLink;
  var minAge = 1;
  var terr;
  var tree, root;
  var width = 0;
  var height = 0;
  var tWidth, tHeight, tOffset;
  var groundThick;
  var numSources;
  var isLive = true;
  var gui;

  var options;
  var Options = function() {
    //actions
    this.generate = function() {
      app.generate();
    }

    //seed params
    this.sparsity = 5;
    this.step_size = 3;
    this.kill_radius = 3;
    this.influence_radius = 4;
    this.lifespan = 80;
    this.ground_roughness = 0.55;


    //real time params
    this.ground_height = 50;
    this.node_min_age = 1;
    this.node_min_radius = 2;
    this.cherry_min_age = 15;
    this.cherry_max_age = 45;
    this.sky_top_color = '#80f2b6';
    this.sky_bottom_color = '#f7c346';
    this.sun_color = [200, 0, 0];
    this.sun_height = 60;
    this.shading = true;
    this.cherries = true;
  }

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

      app.initGui();

      width = canvas.width;
      height = canvas.height;
      tWidth = width*0.9; //tree width
      tHeight = height*0.7; //tree height

      canvas.style.width = width+'px';
      canvas.style.height = height+'px';
      ctx.lineCap = 'round';
      //ctx.lineJoin = 'round';
      //ctx.fillStyle = 'rgba(255, 255, 0, 1)';

      groundThick = height*0.25;
      
      app.generate();
    },

    initGui : function () {
      options = new Options();
      gui = new dat.GUI();

      gui.add(options, 'generate');

      var f1 = gui.addFolder('seed');
      f1.add(options, 'sparsity', 1, 12).step(0.5);
      f1.add(options, 'step_size', 1, 10).step(1);
      f1.add(options, 'kill_radius', 1, 10).step(1);
      f1.add(options, 'influence_radius', 1, 10).step(1);
      f1.add(options, 'lifespan', 1, 150).step(10);
      f1.add(options, 'ground_roughness', 0, 1).step(0.05);

      var f2 = gui.addFolder('real-time');
      f2.add(options, 'ground_height', -50, 100).step(1);
      f2.add(options, 'node_min_age', 0, 100).step(1);
      f2.add(options, 'node_min_radius', 0, 20).step(1);
      f2.add(options, 'cherry_min_age', 0, 50).step(1);
      f2.add(options, 'cherry_max_age', 0, 100).step(1);
      f2.addColor(options, 'sky_top_color');
      f2.addColor(options, 'sky_bottom_color');
      f2.addColor(options, 'sun_color');
      f2.add(options, 'sun_height', 0, 100).step(1);
      f2.add(options, 'shading');
      f2.add(options, 'cherries');

      // Iterate over all controllers to add change events
      gui.__folders['real-time'].__controllers.forEach(function(ctl){
        ctl.onChange(function(value) {
          app.draw();
        });
      });

    },

    generate: function() {
      var sSparsity = options.sparsity; //average distance between sources
      numSources = Math.floor(tHeight*tWidth/sSparsity/sSparsity);
      console.log('Using '+numSources+' sources');
      Node.step = options.step_size;

      tree = new Venation(tWidth, tHeight);
      tree.setKillRadius(options.kill_radius);
      tree.setInfluenceRadius(options.influence_radius);

      root = new Venation(tWidth, height - tHeight);
      root.setKillRadius(options.kill_radius);
      root.setInfluenceRadius(options.influence_radius);

      this.resetTree();

      //generate terrain
      terr = Terrain.generate(width, groundThick, groundThick, options.ground_roughness, 1, 0);

      requestAnimationFrame(app.tick);
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
    
    //Check if the browser has what it takes to run the app
    checkRequierments: function () {
      return true;
    }, 

    cacheElements: function () {
      canvas = document.getElementsByTagName('canvas')[0];
      ctx = canvas.getContext("2d");
      dlLink = document.getElementById('dl-link');
    },

    attachEvents: function () {
      dlLink.addEventListener("click", function(){
        dlLink.setAttribute('href', canvas.toDataURL());
      }, false);      
    },

    run : function () {
      requestAnimationFrame(this.tick);
    },

    tick: function() {
      var oldNodesCount = tree.allNodes.length;

      if (isLive) {
        tree.step();
        root.step();
      }

      app.draw();

      if (tree.age > options.lifespan) {
        isLive = false;
      }
      if (isLive) {
        requestAnimationFrame(app.tick);
      }
      return;

      if (tree.allAuxins.length > 0 && tree.allNodes.length > oldNodesCount && tree.age < options.lifespan){
        requestAnimationFrame(app.tick);
      } else {
        isLive = false;
        minAge++;
        //requestAnimationFrame(app.draw);
        app.done();
      }
      if (minAge >= options.lifespan){
        app.resetTree();
      }
    },

    draw : function() {
      var r1;
      if (tree.allNodes.length > 1){
        app.drawBg();
        //ctx.clearRect(0, 0, width, height);
        ctx.save();

        //tree nodes
        // ctx.translate(tOffset, height - tHeight - options.ground_height - groundThick*0.5);
        ctx.translate(tOffset, height - tHeight - groundThick);
        for (var i=0; i<tree.allNodes.length; i++){
          r1 = tree.allNodes[i];
          if (r1.parent != null && r1.age >= options.node_min_age){
            app.drawNodeCherry(r1, options.shading, options.cherries);  
          }
        }

        //root nodes
        ctx.translate(0, tHeight);
        for (var i=0; i<root.allNodes.length; i++){
          r1 = root.allNodes[i];
          if (r1.parent != null && r1.age >= options.node_min_age){
            app.drawNodeCherry(r1, options.shading, false);
          }
        }

        ctx.restore();
        app.drawFg();
      }
      
    },

    drawNodeCherry : function (node, shading, cherry) {
      var rad = Math.sqrt(node.flow)+1;
      if (rad < options.node_min_radius) {
        return;
      }

      // ctx.arc(node.pos.x, node.pos.y, rad*8, 0, Math.PI * 2);
      // ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      // ctx.fill();

      ctx.lineWidth = rad;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      ctx.lineTo(node.pos.x, node.pos.y);
      ctx.stroke();

      if (shading){
        ctx.lineWidth = rad/3;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(node.parent.pos.x+rad/3, node.parent.pos.y);
        ctx.lineTo(node.pos.x+rad/3, node.pos.y-rad/4);
        ctx.stroke();
      }

      // ctx.lineWidth = rad/2;
      // ctx.beginPath();
      // ctx.moveTo(node.parent.pos.x, node.parent.pos.y);
      // ctx.strokeStyle = 'rgba(128, 0, 0, 1)';
      // ctx.lineTo(node.pos.x, node.pos.y);
      // ctx.stroke();

      //cherries
      if (cherry 
        && node.childCount == 0 
        && (node.age > options.cherry_min_age 
        && node.age < options.cherry_max_age)){
        app.drawCherry(node.parent.pos.x+3,node.parent.pos.y);
      } 
    },

    drawCherry : function (x, y) {
      var rad = 3;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.arc(x, y, rad, 0, Math.PI*2, false);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(x+rad/2, y-rad/2, 1, 0,Math.PI*2, false);
      ctx.fill();
    }, 

    drawBg : function () {
      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, options.sky_top_color);
      grd.addColorStop(1, options.sky_bottom_color);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      //sun
      app.drawSun(width*0.7, height*(1-options.sun_height/100), Math.min(width, height)/4);
    },

    drawSun: function(x, y, rad) {
      function arrToColor(rgb, alpha) {
        return 'rgba('+Math.round(rgb[0])+', '+Math.round(rgb[1])+', '+Math.round(rgb[2])+', '+alpha+')';
      }

      ctx.beginPath();
      var grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, arrToColor(options.sun_color, 1));
      grd.addColorStop(0.25, arrToColor(options.sun_color, 1));
      grd.addColorStop(0.7, arrToColor(options.sun_color, 0));
      ctx.fillStyle = grd;
      ctx.arc(x, y, rad, 0, Math.PI*2, false);
      ctx.fill();
    }, 

    drawFg : function () {
      var delta = - options.ground_height + groundThick*0.5;
      //ground
      ctx.fillStyle = 'black';
      // ctx.fillRect(0, height-groundHeight, width, height);
      ctx.beginPath();
      ctx.moveTo(0, height - terr[0] + delta);
      for (var t = 1; t < width; t++) {
        ctx.lineTo(t, height - terr[t] + delta);
      }
      // finish creating the rect so we can fill it
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // ctx.strokeStyle = '#0f0';
      // ctx.strokeRect(0, height*0.75 + delta, width, height*0.25);
    },

    done: function () {
      dlLink.setAttribute('href', canvas.toDataURL());
      dlLink.style.visibility = 'visible';
      console.log('root age: '+tree.allNodes[0].age);
    }
  };

  return app;
});
