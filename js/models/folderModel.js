define(["jquery", "backbone", "global"], function($, Backbone, global) {

  var FolderModel = Backbone.Model.extend({
    idAttribute: "folderID"
  });

  return FolderModel;
});
