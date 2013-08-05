define(["backbone", "global", "flashMessage",
  "models/userModel",
  "af"], function(Backbone, global, FlashMessage,
    UserModel) {

  var LoginView = Backbone.View.extend({
    el: '#loginPage',
    pageId: '#loginPage',
    events: {
      'click #loginButton': 'login'
    },

    initialize: function() {
      $.ui.disableSideMenu();

      var me = this;

      var user = window.localStorage.getItem("user");

      if (user) {
        user = JSON.parse(user);
        $('#user').val( user.user );
        $('#password').val( user.password );

        if( window.localStorage.getItem("keepOnLoginPage") ) {
          window.localStorage.removeItem("keepOnLoginPage");
          $.ui.loadContent(me.pageId);
        } else {
          this.login();
        }
      } else {
        $.ui.loadContent(me.pageId);
      };
    },

    login: function(event) {
      var me = this;
      if(event) event.preventDefault();
      $.ui.showMask("Logando...");

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
            this.router.navigate("#home", {trigger: true});
            // this.router.navigate('#home');
          } else {
            if(!event)
              $.ui.loadContent(me.pageId);
          }
        },
        error: function(model, xhr){
          FlashMessage.error("O Expresso nesse momento está fora do ar.")
        },
        complete: function() {
          $.ui.hideMask("");
        }
      });
    }
  });

  return LoginView;

});
