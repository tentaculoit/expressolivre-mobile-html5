define(["jquery", "backbone", "global", "cache", "flashMessage",
  "models/messageModel",
  "text!templates/messageShowBlock.html"], function($, Backbone, global, Cache, FlashMessage,
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

        $.mobile.loading("show", { text: "Carregando Email", textVisible: true });

        messageModel.fetch({
          success: function(message){
            Cache.Collections.folders.get( Cache.currentFolder.get("folderID") )
              .get("messages").get( me.messageID ).set( messageModel.attributes );
            me.renderSuccessCallback(message);
          },
          error: function(collection, xhr){
            FlashMessage.success("Não foi possível carregar esse email");
          },
          complete: function() {
            $.mobile.loading("hide");
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

      $(me.pageId + " a.backButton").attr("href","#folder?" + Cache.currentFolder.idToUrl());
      $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
    },

    remove: function(event) {
      var me = this;
      if(event) event.preventDefault();

      Cache.Views.message.model.destroy({
        success: function(model, response){
          Cache.Collections.folders.get( Cache.currentFolder.get("folderID") ).get("messages").remove( Cache.Views.message.model );
          Cache.Views.message.model = null;

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
