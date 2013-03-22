define(["jquery", "backbone", "global", "models/messageModel"], function($, Backbone, global, MessageModel) {

  var MessageCollection = Backbone.Collection.extend({
    model: MessageModel,
    url: global.app.service + "/Mail/Messages",

    sync:function(method, collection, options) {
      options = options ? _.clone(options) : {};
      options.type = "POST";
      options.contentType='application/json';

      var data = (options.data && options.data.attributes) ? _.clone(options.data.attributes) : {};

      data.auth = global.app.auth;
      options.data = "params=" + JSON.stringify(data);
      Backbone.sync.call(this, method, collection, options);
    },

    parse: function(response) {
      return response.result.messages ? response.result.messages : [];
    }
  });

  return MessageCollection;

});
