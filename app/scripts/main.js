require.config({
  paths: {
  },
  shim: {
  },
  waitSeconds: 5
});

require(['app'], function(App){
  'use strict';
  App.init();
  // App.run();
});
