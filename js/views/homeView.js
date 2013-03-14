define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var HomeView = Backbone.View.extend({
    el: '#homeView',
    events: {

    },

    initialize: function() {
      $.mobile.changePage( "#homeView", { reverse: false, changeHash: false } );
    },
  });

  return HomeView;

});
