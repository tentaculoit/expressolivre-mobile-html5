define(["jquery", "backbone", "global", "models/folderModel", "collections/folderCollection"], function($, Backbone, global, FolderModel, FolderCollection) {

  var HomeView = Backbone.View.extend({
    pageId: '#homePage',
    events: {

    },

    initialize: function() {
      var me = this;

      me.buildMenu( function() {
        $(me.pageId + ' #defaultPanel').html($('#menuBlock').html());
        $.mobile.navigate( "#folder?INBOX" );
      } );
    },

    render: function(){
      $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
    },

    buildMenu: function(finish) {
      $.mobile.loading("show", { text: "Logando"});
      this.foldersCollection = new FolderCollection();

      this.foldersCollection.fetch({
        success: function(collection, response){

          menuItens = "";
          menuItemTemplate = _.template($('#menu-item-template').html());

          collection.each(function(folder){
            folder.set({ idToUrl: folder.idToUrl() })
            menuItens = menuItens + menuItemTemplate({folder: folder.toJSON()});
          });

          $('#menuBlock').html( _.template( $('#menuTemplate').html() ) );
          $($.parseHTML(menuItens)).insertAfter($('#menuBlock #menuList #menuTitle'));
        },
        error: function(collection, xhr){
          console.log(xhr);
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
