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

        Cache.currentFolder  = Cache.Collections.folders.get(folderIDParsed);

        if( Cache.Views.folder ) {
          Cache.Views.folder.render();
        } else {
          Cache.Views.folder = new FolderView();
        }
      }
    },

    message: function(messageID) {
      if(this.canAccess()) {
        if( Cache.Views.message ) {
          Cache.Views.message.messageID = messageID;
          Cache.Views.message.render();
        } else {
          Cache.Views.message = new MessageView( { messageID: messageID } );
        }
      }
    },

    messageForm: function(action) {
      if(this.canAccess()) {

        if( Cache.Views.messageForm ) {
          Cache.Views.messageForm.action = action;
          Cache.Views.messageForm.render();
        } else {
          Cache.Views.messageForm = new MessageFormView( { action: action } );
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
