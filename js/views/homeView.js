define(["jquery", "backbone", "global", "cache", "flashMessage",
  "models/folderModel",
  "collections/folderCollection"], function($, Backbone, global, Cache, FlashMessage,
    FolderModel,
    FolderCollection) {

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
      Cache.Collections.folders = new FolderCollection();

      Cache.Collections.folders.fetch({
        success: function(collection, response){

          menuItens = "";
          menuItemTemplate = _.template($('#menu-item-template').html());

          collection.each(function(folder){
            folder.set({ idToUrl: folder.idToUrl() })
            menuItens = menuItens + menuItemTemplate({folder: folder.toJSON()});
          });

          $('#menuBlock').html( _.template( $('#menuTemplate').html() ) );
          $($.parseHTML(menuItens)).insertAfter($('#menuBlock #menuList #menuTitle'));

          finish.call();
        },
        error: function(collection, xhr){
          FlashMessage.error("O sistema está temporariamente fora do ar.");
          $.mobile.navigate( "#logout" );
        },
        complete: function() {
          $.mobile.loading("hide");
        }
      });
    }
  });

  return HomeView;

});
