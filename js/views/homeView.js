define(["jquery", "backbone", "global", "models/folderModel", "collections/folderCollection"], function($, Backbone, global, FolderModel, FolderCollection) {

  var HomeView = Backbone.View.extend({
    el: '#homePage',
    events: {

    },

    initialize: function() {
      var me = this;

      me.buildMenu( function() {
        $('#homePage #defaultPanel').html($('#menu-template').html());
        $.mobile.navigate( "#folder?INBOX" );
      } );
    },

    render: function(){
      $.mobile.changePage( "#homePage", { reverse: false, changeHash: false } );
    },

    buildMenu: function(finish) {
      $.mobile.loading("show", { text: "Logando"});
      this.foldersCollection = new FolderCollection();

      this.foldersCollection.fetch({
        success: function(collection, response){
          menuItens = "";
          menuItemTemplate = _.template($('#menu-item-template').html());

          collection.each(function(folder){
            folder.set({ idToUrl: folder.get("folderID").replace("/","-") })
            menuItens = menuItens + menuItemTemplate({folder: folder.toJSON()});
          });

          $($.parseHTML(menuItens)).insertAfter($('#menuTitle'));
        },
        error: function(collection, xhr){
          alert(xhr)
        },
        complete: function() {
          $.mobile.loading("hide");
          finish.call();
        }
      });
    }
  });

  return HomeView;

});
