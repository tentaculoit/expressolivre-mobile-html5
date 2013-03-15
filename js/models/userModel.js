define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var UserModel = Backbone.Model.extend({
    urlRoot: global.app.service + "/Login",

    parse: function (response) {
      return response.result;
    },

    sync:function(method, model, options) {
        if ( (method=="update")||(method=="create") ) {
            options = options ? _.clone(options) : {};
            options.contentType='application/json';

            options.data = "params=" + JSON.stringify(model.toJSON());
        }

        Backbone.sync.call(this, method, this, options);
    }
  });

  return UserModel;
});
