define(["backbone", "global", "cache", "flashMessage",
  "models/messageModel",
  "text!templates/messageShowBlock.html",
  "af"], function(Backbone, global, Cache, FlashMessage,
    MessageModel,
    messageShowBlockTemplate) {

  var MessageView = Backbone.View.extend({
    el: '#messagePage',
    pageId: '#messagePage',
    events: {
      'click #removeMessage': 'remove'
    },

    initialize: function() {
      var me = this;
      me.messageID = this.options.messageID;
      me.render();
    },

    render: function(){
      var me = this;

      var messageModel = Cache.Collections.folders.get( Cache.currentFolder.get("folderID") ).get("messages").get( me.messageID );

      if( messageModel.get("msgBody") ) {
        me.renderSuccessCallback(messageModel);
      } else {
        messageModel    = new MessageModel({ msgID: me.messageID, folderID: Cache.currentFolder.get("folderID")})

        $.ui.showMask("Carregando Email...");

        messageModel.fetch({
          success: function(message){
            Cache.Collections.folders.get( Cache.currentFolder.get("folderID") )
              .get("messages").get( me.messageID ).set( messageModel.attributes );
            me.renderSuccessCallback(message);
          },
          error: function(collection, xhr){
            FlashMessage.error("Não foi possível carregar esse email");
          },
          complete: function() {
            $.ui.hideMask("");
          }
        });
      }
    },

    renderSuccessCallback: function(message) {
      var me = this;
      messageTemplate = _.template(messageShowBlockTemplate);

      var messageItemSelector = $(me.pageId + " #messageItem");

      messageItemSelector.html( $.parseHTML( messageTemplate({message: message.toJSON()}) ) );

      if(messageItemSelector.hasClass('ui-listview'))
        messageItemSelector.listview('refresh');

      Cache.currentMessage = message;

      $(me.pageId + " a.backButton").attr("href","#folder?" + Cache.currentFolder.idToUrl());
      $.ui.loadContent(me.pageId);
    },

    remove: function(event) {
      var me = this;
      if(event) event.preventDefault();

      Cache.currentMessage.destroy({
        success: function(model, response){
          Cache.Collections.folders.get( Cache.currentFolder.get("folderID") ).get("messages").remove( Cache.currentMessage );
          Cache.currentMessage = null;

          $.mobile.navigate( "#folder?" + Cache.currentFolder.idToUrl() );
          FlashMessage.success("Email removido com sucesso");
        },
        error: function(model, xhr){
          FlashMessage.error("Não foi possível remover esse email");
        }
      });
    }
  });

  return MessageView;
});
