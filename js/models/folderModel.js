define(["backbone", "global", "af"], function(Backbone, global) {

  var FolderModel = Backbone.Model.extend({
    urlRoot: global.app.service + "/Mail/Folders",
    idAttribute: "folderID",

    methodUrl:  function(method){
      if(method == "delete") {
        return global.app.service + "/Mail/Delfolder";
      } else if(method == "update") {
        return global.app.service + "/Mail/Renamefolder";
      } else if(method == "create") {
        return global.app.service + "/Mail/Addfolder";
      } else if(method == "read") {
        return global.app.service + "/Mail/Folders";
      }
      return false;
    },

    sync: function(method, model, options) {
      options.data = "params=" + JSON.stringify(model.attributes);

      Backbone.sync.call(this, method, this, options);
    },

    idToUrl: function(){
      return (this.get("folderID")) ? this.get("folderID").replace("/","-") : "";
    }

  });

  return FolderModel;
});
