define(["jquery", "backbone", "global", "models/userModel"], function($, Backbone, global, UserModel) {

  var LoginView = Backbone.View.extend({
    el: '#loginPage',
    pageId: '#loginPage',
    events: {
      'click #loginButton': 'login'
    },

    initialize: function() {
      var me = this;
      $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
    },

    login: function(event) {
      var me = this;
      event.preventDefault();
      $.mobile.loading("show", { text: "Logando", textVisible: true });

      var user = new UserModel( { user: $('#user').val(), password: $('#password').val() } )

      user.save(null,{
        success: function(model, response){
          global.app.auth = model.get("auth");
          $.mobile.navigate( "#home" );
        },
        error: function(model, xhr){
          alert(xhr)
        },
        complete: function() {
          $.mobile.loading("hide");
        }
      });
    }
  });

  return LoginView;

});
