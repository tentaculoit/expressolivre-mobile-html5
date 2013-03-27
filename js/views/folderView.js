define(["jquery", "backbone", "global", "cache", "flashMessage",
  "collections/messageCollection",
  "models/messageModel",
  "text!templates/messageListBlock.html"], function($, Backbone, global, Cache, FlashMessage,
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
        $.mobile.loading("show", { text: "Carregando Emails", textVisible: true });

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
            $.mobile.loading("hide");
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

      messageListSelector.html($.parseHTML(messages)) ;

      //se a página já foi carregada uma vez, dá um refresh no listview
      if(messageListSelector.hasClass('ui-listview'))
        messageListSelector.listview('refresh');

      $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
      $(me.pageId + ' #defaultPanel').panel( "close" );
    }
  });

  return FolderView;
});
