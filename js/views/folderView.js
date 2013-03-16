define(["jquery", "backbone", "global", "collections/messageCollection" ], function($, Backbone, global, MessageCollection) {

  var FolderView = Backbone.View.extend({
    el: '#folderPage',
    events: {
    },

    initialize: function() {
      $('#folderPage #defaultPanel').html($('#menu-template').html())
      this.render();
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

          $('#folderPage #title').html(me.model.get("folderName"));

          var messageListSelector = $('#folderPage #message-list')

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
          $.mobile.changePage( "#folderPage", { reverse: false, changeHash: false } );
          $('#folderPage #defaultPanel').panel( "close" );
        }
      });
    }
  });

  return FolderView;
});