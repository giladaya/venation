define(['jquery'], function ($) {
  'use strict';

  function showError (msg) {
    alert(msg);
    console.log(msg);
  }
  
  return {
    init: function () {
      console.log('Hello!');
      if (!this.checkRequierments()) {
        showError('Your browser is not supported. Please use Chrome, Firefox or IE10 and above');
        return false;
      }
      this.cacheElements();
      this.attachEvents();
    },
    
    checkRequierments: function () {
      return (window.FormData && window.localStorage);
    }, 

    cacheElements: function () {
    },

    attachEvents: function () {
    }   
  };
});
