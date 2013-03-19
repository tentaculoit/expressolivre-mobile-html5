// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", "global",
  "views/loginView", "views/homeView", "views/folderView", "views/messageView",
  "models/folderModel", "models/messageModel",
  "text!templates/login.html", "text!templates/home.html", "text!templates/folder.html", "text!templates/message.html"  ],

  function( $, Backbone, global,
    LoginView, HomeView, FolderView, MessageView,
    FolderModel, MessageModel,
    loginTemplate, homeTemplate, folderTemplate, messageTemplate ) {

  // Extends Backbone.Router
  var MobileRouter = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
      $("body").append(_.template(loginTemplate))
        .append(_.template(homeTemplate))
        .append(_.template(folderTemplate))
        .append(_.template(messageTemplate));

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
      "message?:messageID": "message",
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
        var messageModel    = new MessageModel({ folderID: folderIDParsed})

        this.currentFolder  = this.homeView.foldersCollection.get(folderIDParsed);

        if( this.folderView ) {
          this.folderView.model = this.currentFolder;
          this.folderView.messageModel = messageModel;
          this.folderView.render();
        } else {
          this.folderView = new FolderView( { model: this.currentFolder, messageModel: messageModel } );
        }
      }
    },

    message: function(messageID) {
      if(this.canAccess()) {
        var messageModel    = new MessageModel({ msgID: messageID, folderID: this.currentFolder.get("folderID")})

        if( this.messageView ) {
          this.messageView.model = messageModel;
          this.messageView.folderModel = this.currentFolder;
          this.messageView.render();
        } else {
          this.messageView = new MessageView( { model: messageModel, folderModel: this.currentFolder } );
        }
      }
    },

    logout: function() {
      if(this.canAccess()) {
        document.location.reload();
      }
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
