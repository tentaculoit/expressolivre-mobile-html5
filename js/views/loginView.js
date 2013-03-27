define(["jquery", "backbone", "global", "flashMessage",
  "models/userModel"], function($, Backbone, global, FlashMessage,
    UserModel) {

  var LoginView = Backbone.View.extend({
    el: '#loginPage',
    pageId: '#loginPage',
    events: {
      'click #loginButton': 'login'
    },

    initialize: function() {
      var me = this;

      var user = window.localStorage.getItem("user");

      if (user) {
        user = JSON.parse(user);
        $('#user').val( user.user );
        $('#password').val( user.password );

        if( window.localStorage.getItem("keepOnLoginPage") ) {
          window.localStorage.removeItem("keepOnLoginPage");
          $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
        } else {
          this.login();
        }
      } else {
        $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
      };
    },

    login: function(event) {
      var me = this;
      if(event) event.preventDefault();
      $.mobile.loading("show", { text: "Logando", textVisible: true });

      var dadosLogin = { user: $('#user').val(), password: $('#password').val() };
      var user = new UserModel( dadosLogin );

      user.save(null,{
        success: function(model, response){
          if( !model.hasError() ) {
            global.app.auth = model.get("auth");

            if( $('#salvarConta option:selected:first').val() == 1 ) {
              window.localStorage.setItem("user", JSON.stringify(dadosLogin) );
            } else {
              window.localStorage.removeItem("user");
            }

            $.mobile.navigate( "#home" );
          } else {
            if(!event)
              $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
          }
        },
        error: function(model, xhr){
          FlashMessage.error("O Expresso nesse momento está fora do ar.")
        },
        complete: function() {
          $.mobile.loading("hide");
        }
      });
    }
  });

  return LoginView;

});
