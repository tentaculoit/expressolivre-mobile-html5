// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", "global", "views/LoginView", "views/HomeView", "views/FolderView", "models/FolderModel", "models/MessageModel"  ], function( $, Backbone, global, LoginView, HomeView, FolderView, FolderModel, MessageModel ) {
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
      "home": "home",
      "login": "login",
      "logout": "logout",
      "folder?:folderID": "folder",
      "*defaults": "home"
    },

    login: function() {
      new LoginView();
    },

    home: function() {
      if(this.canAccess()) {
        if( this.homeView ) {
          this.homeView.render();
        } else {
          this.homeView = new HomeView();
        }
      }
    },

    folder: function(folderID) {
      if(this.canAccess()) {
        var folderIDParsed  = folderID.replace("-","/");
        var folderModel     = this.homeView.foldersCollection.get(folderIDParsed);
        var messageModel    = new MessageModel({ folderID: folderIDParsed})

        if( this.folderView ) {
          this.folderView.model = folderModel;
          this.folderView.messageModel = messageModel;
          this.folderView.render();
        } else {
          this.folderView = new FolderView( { model: folderModel, messageModel: messageModel } );
        }
      }
    },

    logout: function() {
      global.app.auth = null;
      $.mobile.navigate( "#login" );
    },

    canAccess: function() {
      if(global.app.auth) {
        return true;
      } else {
        $.mobile.navigate( "#login" );
        return false;
      }
    }
  } );

  return MobileRouter;
} );