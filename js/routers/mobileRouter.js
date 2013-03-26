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
      "messageDelete" : "messageDelete",
      "messageForm?:action": "messageForm",
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

    messageForm: function(action) {
      if(this.canAccess()) {
        var messageModel = new MessageModel();

        switch(action) {
          case "reply":
            messageModel.set("msgID", this.messageView.model.get("msgID"));
            messageModel.set("msgFrom", this.messageView.model.get("msgFrom"));
            messageModel.set("msgSubject", "Re: " + this.messageView.model.get("msgSubject"));
            messageModel.set("msgBody", this.messageView.model.get("msgBody"));

            break;
          case "forward":
            messageModel.set("msgID", this.messageView.model.get("msgID"));
            messageModel.set("msgSubject", "Fw: " + this.messageView.model.get("msgSubject"));
            messageModel.set("msgBody", this.messageView.model.get("msgBody"));

            break;
          case "newFromEmail":
            messageModel.set("msgID", this.messageView.model.get("msgID"));
        }

        if( this.messageFormView ) {
          this.messageFormView.model = messageModel;
          this.messageFormView.folderModel = this.currentFolder;
          this.messageFormView.action = action;
          this.messageFormView.render();
        } else {
          this.messageFormView = new MessageFormView( { model: messageModel, folderModel: this.currentFolder, action: action } );
        }
      }
    },

    messageDelete: function() {
      if(this.canAccess()) {
        this.messageView.remove();
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
