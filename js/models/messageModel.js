define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var MessageModel = Backbone.Model.extend({
    urlRoot: global.app.service + "/Mail/Messages",
    idAttribute: "msgID",

    methodUrl:  function(method){
      return { url: global.app.service + "/Mail/Messages", method: "POST" };
    },

    methodUrl:  function(method){
      if(method == "delete") {
        return { url: global.app.service + "/Mail/DelMessage", method: "POST" };
      } else if(method == "update") {
        return { url: global.app.service + "/Mail/Send", method: "POST" };
      } else if(method == "create") {
        return { url: global.app.service + "/Mail/Send", method: "POST" };
      } else if(method == "read") {
        return { url: global.app.service + "/Mail/Messages", method: "POST" };
      }
      return false;
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
