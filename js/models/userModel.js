define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var UserModel = Backbone.Model.extend({
    urlRoot: global.app.service + "/Login"
  });

  return UserModel;
});
