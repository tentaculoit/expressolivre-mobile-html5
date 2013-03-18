define(["jquery", "backbone", "global", "collections/messageCollection", "text!templates/folder.html"], function($, Backbone, global, MessageCollection, textTemplate) {

  var FolderView = Backbone.View.extend({
    el: '#folderPage',
    template: _.template(textTemplate),
    events: {
    },

    initialize: function() {
      var me = this;
      $("body").append(me.template);
      $('#folderPage #defaultPanel').html($('#menuBlock').html())
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

          $('#folderPage #title').html(me.model.get("folderName"));

          var messageListSelector = $('#folderPage #messageList')

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
