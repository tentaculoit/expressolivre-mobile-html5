// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", "global", "cache",
  "views/loginView", "views/homeView", "views/folderView", "views/messageView", "views/messageFormView",
  "models/folderModel", "models/messageModel",
  "text!templates/loginPage.html", "text!templates/homePage.html", "text!templates/folderPage.html", "text!templates/messagePage.html",
  "text!templates/messageFormPage.html" ],

  function( $, Backbone, global, Cache,
    LoginView, HomeView, FolderView, MessageView, MessageFormView,
    FolderModel, MessageModel,
    loginPageTemplate, homePageTemplate, folderPageTemplate, messagePageTemplate,
    messageFormPageTemplate ) {

  // Extends Backbone.Router
  var MobileRouter = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
      $("body").append(_.template(loginPageTemplate))
        .append(_.template(homePageTemplate))
        .append(_.template(folderPageTemplate))
        .append(_.template(messagePageTemplate))
        .append(_.template(messageFormPageTemplate));

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
      "messageForm?:action": "messageForm",
      "*defaults": "home"
    },

    login: function() {
      new LoginView();
    },

    home: function() {
      if(this.canAccess()) {
        if( Cache.Views.home ) {
          Cache.Views.home.render();
        } else {
          Cache.Views.home = new HomeView();
        }
      }
    },

    folder: function(folderID) {
      if(this.canAccess()) {
        var folderIDParsed  = folderID.replace("-","/");
        var messageModel    = new MessageModel({ folderID: folderIDParsed})

        this.currentFolder  = Cache.Views.home.foldersCollection.get(folderIDParsed);

        if( Cache.Views.folder ) {
          Cache.Views.folder.model = this.currentFolder;
          Cache.Views.folder.messageModel = messageModel;
          Cache.Views.folder.render();
        } else {
          Cache.Views.folder = new FolderView( { model: this.currentFolder, messageModel: messageModel } );
        }
      }
    },

    message: function(messageID) {
      if(this.canAccess()) {
        var messageModel    = new MessageModel({ msgID: messageID, folderID: this.currentFolder.get("folderID")})

        if( Cache.Views.message ) {
          Cache.Views.message.model = messageModel;
          Cache.Views.message.folderModel = this.currentFolder;
          Cache.Views.message.render();
        } else {
          Cache.Views.message = new MessageView( { model: messageModel, folderModel: this.currentFolder } );
        }
      }
    },

    messageForm: function(action) {
      if(this.canAccess()) {

        if( Cache.Views.messageForm ) {
          Cache.Views.messageForm.model = Cache.Views.message.model;
          Cache.Views.messageForm.folderModel = this.currentFolder;
          Cache.Views.messageForm.action = action;
          Cache.Views.messageForm.render();
        } else {
          Cache.Views.messageForm = new MessageFormView( { model: Cache.Views.message.model, folderModel: this.currentFolder, action: action } );
        }
      }
    },

    logout: function() {
      if(this.canAccess()) {
        window.localStorage.setItem("keepOnLoginPage", "1");
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
