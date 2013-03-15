define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var MessageModel = Backbone.Model.extend({
    idAttribute: "msgID"
  });

  return MessageModel;
});
