define(["jquery", "backbone", "global", "collections/messageCollection", "models/messageModel"], function($, Backbone, global, MessageCollection, MessageModel) {

  var FolderView = Backbone.View.extend({
    pageId: '#folderPage',
    events: {
    },

    initialize: function() {
      var me = this;
      me.messageModel = this.options.messageModel;

      $(me.pageId + ' #defaultPanel').html($('#menuBlock').html())
      me.render();
    },

    render: function(){
      var me = this;
      $.mobile.loading("show", { text: "Carregando Emails", textVisible: true });

      var messages = new MessageCollection( { model: me.messageModel } );

      messages.fetch({
        data: me.messageModel,
        success: function(collection, response){

          messages = "";
          messageTemplate = _.template($('#message-item-list-template').html());

          collection.each(function(message){
            messages = messages + messageTemplate({message: message.toJSON()});
          });

          $(me.pageId + ' #title').html(me.model.get("folderName"));

          var messageListSelector = $(me.pageId + ' #messageList');

          messageListSelector.html($.parseHTML(messages)) ;

          //se a página já foi carregada uma vez, dá um refresh no listview
          if(messageListSelector.hasClass('ui-listview'))
            messageListSelector.listview('refresh');

        },
        error: function(collection, xhr){
          alert(xhr)
        },
        complete: function() {
          $.mobile.loading("hide");
          $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
          $(me.pageId + ' #defaultPanel').panel( "close" );
        }
      });
    }
  });

  return FolderView;
});
