define(["jquery", "backbone", "global", "models/folderModel"], function($, Backbone, global, FolderModel) {

  var FolderCollection = Backbone.Collection.extend({
    model: FolderModel,
    url: global.app.service + "/Mail/Folders",

    sync:function(method, model, options) {
      options = options ? _.clone(options) : {};
      options.type = "POST";
      options.contentType='application/json';

      var data = (options.data && options.data.attributes) ? _.clone(options.data.attributes) : {};

      data.auth = global.app.auth;
      options.data = "params=" + JSON.stringify(data);
      Backbone.sync.call(this, method, model, options);
    },

    parse: function(response) {
      return response.result.folders;
    }
  });

  return FolderCollection;

});
