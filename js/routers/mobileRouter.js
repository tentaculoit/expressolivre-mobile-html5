// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "backbone", "global",
  "views/loginView", "views/homeView", "views/folderView", "views/messageView", "views/messageFormView",
  "models/folderModel", "models/messageModel",
  "text!templates/loginPage.html", "text!templates/homePage.html", "text!templates/folderPage.html", "text!templates/messagePage.html",
  "text!templates/messageFormPage.html" ],

  function( $, Backbone, global,
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
        if( global.cache.views.home ) {
          global.cache.views.home.render();
        } else {
          global.cache.views.home = new HomeView();
        }
      }
    },

    folder: function(folderID) {
      if(this.canAccess()) {
        var folderIDParsed  = folderID.replace("-","/");
        var messageModel    = new MessageModel({ folderID: folderIDParsed})

        this.currentFolder  = global.cache.views.home.foldersCollection.get(folderIDParsed);

        if( global.cache.views.folder ) {
          global.cache.views.folder.model = this.currentFolder;
          global.cache.views.folder.messageModel = messageModel;
          global.cache.views.folder.render();
        } else {
          global.cache.views.folder = new FolderView( { model: this.currentFolder, messageModel: messageModel } );
        }
      }
    },

    message: function(messageID) {
      if(this.canAccess()) {
        var messageModel    = new MessageModel({ msgID: messageID, folderID: this.currentFolder.get("folderID")})

        if( global.cache.views.message ) {
          global.cache.views.message.model = messageModel;
          global.cache.views.message.folderModel = this.currentFolder;
          global.cache.views.message.render();
        } else {
          global.cache.views.message = new MessageView( { model: messageModel, folderModel: this.currentFolder } );
        }
      }
    },

    messageForm: function(action) {
      if(this.canAccess()) {

        if( global.cache.views.messageForm ) {
          global.cache.views.messageForm.model = global.cache.views.message.model;
          global.cache.views.messageForm.folderModel = this.currentFolder;
          global.cache.views.messageForm.action = action;
          global.cache.views.messageForm.render();
        } else {
          global.cache.views.messageForm = new MessageFormView( { model: global.cache.views.message.model, folderModel: this.currentFolder, action: action } );
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
