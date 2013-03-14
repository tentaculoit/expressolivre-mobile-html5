define(["jquery", "backbone", "global", "models/userModel"], function($, Backbone, global, UserModel) {

  var LoginView = Backbone.View.extend({
    el: '#loginView',
    events: {
      'click #loginButton': 'login'
    },

    initialize: function() {
      $.mobile.changePage( "#loginView", { reverse: false, changeHash: false } );
    },

    login: function(event) {
      event.preventDefault();
      $.mobile.loading("show", { text: "Logando"});

      var user = new UserModel( { user: $('#user').val(), password: $('#password').val() } )

      user.save(null,{
        success: function(model, response){
          global.app.auth = model.get("auth");
          $.mobile.navigate( "#homeView" );
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
