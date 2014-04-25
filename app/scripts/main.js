require.config({
  paths: {
    'jquery': "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
    'underscore': "vendor/underscore-amd/underscore"
  },
  shim: {
  },
  waitSeconds: 5
});

require(['app'], function(App){
  'use strict';
  App.init();
  App.run();
});
