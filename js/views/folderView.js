define(["backbone", "global", "cache", "flashMessage",
  "collections/messageCollection",
  "models/messageModel",
  "text!templates/messageListBlock.html",
  "af"], function(Backbone, global, Cache, FlashMessage,
    MessageCollection,
    MessageModel,
    messageListBlockTemplate) {

  var FolderView = Backbone.View.extend({
    pageId: '#folderPage',

    initialize: function() {
      var me = this;

      $(me.pageId + ' #defaultPanel').html($('#menuBlock').html())
      me.render();
    },

    render: function(){
      var me = this;


      var folderID = Cache.currentFolder.get("folderID");

      var messageFilter = new MessageModel( { folderID: folderID } );
      var messagesCollection = new MessageCollection( { model: messageFilter } );

      var messagesCollection = Cache.Collections.folders.get(folderID).get("messages");

      if( messagesCollection ) {
        me.renderSuccessCallback(messagesCollection);
      } else {
        $.ui.showMask("Carregando Emails...");

        messagesCollection = new MessageCollection( { model: messageFilter } );

        messagesCollection.fetch({
          data: messageFilter,
          success: function(collection){
            Cache.Collections.folders.get(folderID).set("messages", messagesCollection);
            me.renderSuccessCallback(collection);
          },
          error: function(collection, xhr){
            $(me.pageId + ' #defaultPanel').panel( "close" );
            FlashMessage.error("Não foi possível carregar as mensagens da pasta " + Cache.currentFolder.get("folderName") );
          },
          complete: function() {
            $.ui.hideMask("");
          }
        });
      }
    },

    renderSuccessCallback: function(collection) {
      var me = this;
      messages = "";
      messageTemplate = _.template(messageListBlockTemplate);

      collection.each(function(message){
        messages = messages + messageTemplate({message: message.toJSON()});
      });

      $(me.pageId + ' #title').html( Cache.currentFolder.get("folderName") );

      var messageListSelector = $(me.pageId + ' #messageList');

      messageListSelector.html(messages) ;

      // $.ui.updatePanel(id,content);
      $.ui.loadContent(me.pageId);
    }
  });

  return FolderView;
});
