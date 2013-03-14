// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", "global", "views/LoginView", "views/HomeView"  ], function( $, Backbone, global, LoginView, HomeView ) {
  // Extends Backbone.Router
  var MobileRouter = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
      // Tells Backbone to start watching for hashchange events
      Backbone.history.start();
    },

    // Backbone.js Routes
    routes: {
      // When there is no hash bang on the url, the home method is called
      "": "home",
      "homeView": "home",
      "loginView": "login",
      "sair": "sair",
      "*defaults": "home"
    },

    login: function() {
      new LoginView();
    },

    home: function() {
      if(this.canAccess())
        new HomeView();
    },

    sair: function() {
      global.app.auth = null;
      $.mobile.changePage( "#loginView", { reverse: false, changeHash: false } );
    },

    canAccess: function() {
      if(global.app.auth) {
        return true;
      } else {
        $.mobile.navigate( "#loginView" );
        return false;
      }
    }
  } );

  return MobileRouter;
} );
