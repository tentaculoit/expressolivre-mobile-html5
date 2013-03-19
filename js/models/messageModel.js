define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var MessageModel = Backbone.Model.extend({
    urlRoot: global.app.service + "/Mail/Messages",
    idAttribute: "msgID",

    methodUrl:  function(method){
      return { url: global.app.service + "/Mail/Messages", method: "POST" };
    },

    parse: function(response) {
      if ( response.result && _.isObject(response.result.messages) ) {
        return response.result.messages[0];
      } else {
        return response;
      }
    }

  });

  return MessageModel;
});
