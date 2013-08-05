define(["backbone", "global", "cache", "flashMessage",
  "models/folderModel",
  "collections/folderCollection",
  "af"], function(Backbone, global, Cache, FlashMessage,
    FolderModel,
    FolderCollection) {

  var HomeView = Backbone.View.extend({
    pageId: '#homePage',
    events: {

    },

    initialize: function() {
      var me = this;

      me.buildMenu( function() {
        // $(me.pageId + ' #defaultPanel').html($('#menuBlock').html());
        this.router.navigate("#folder?INBOX", {trigger: true});
      } );
    },

    render: function(){
      var me = this;
      $.ui.loadContent(me.pageId);
    },

    buildMenu: function(finish) {
      $.ui.showMask("Carregando Pastas...");
      Cache.Collections.folders = new FolderCollection();

      Cache.Collections.folders.fetch({
        success: function(collection, response){

          menuItens = "";
          menuItemTemplate = _.template($('#menu-item-template').html());

          collection.each(function(folder){
            folder.set({ idToUrl: folder.idToUrl() })
            $('#sideMenu ul').append( menuItemTemplate({folder: folder.toJSON()}) );
          });

          $.ui.updateSideMenuElements($("#sideMenu"));

          // $('#sideMenu ul').append( menuItemTemplate({folder: folder.toJSON()}) );

          // $('#sideMenu ul').append( _.template( $('#menuTemplate').html() ) );
          // $($.parseHTML(menuItens)).insertAfter($('#menuBlock #menuList #menuTitle'));

          finish.call();
        },
        error: function(collection, xhr){
          FlashMessage.error("O sistema está temporariamente fora do ar.");
          this.router.navigate("#logout", {trigger: true});
        },
        complete: function() {
          $.ui.hideMask("");
        }
      });
    }
  });

  return HomeView;

});
