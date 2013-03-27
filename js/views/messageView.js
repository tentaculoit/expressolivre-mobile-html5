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
      me.folderModel = this.options.folderModel;
      me.render();
    },

    render: function(){
      var me = this;
      $.mobile.loading("show", { text: "Carregando Email", textVisible: true });

      $(me.pageId + " a.backButton").attr("href","href","#folder?" + me.folderModel.idToUrl());

      me.model.fetch({
        success: function(message){
          messageTemplate = _.template(messageShowBlockTemplate);

          var messageItemSelector = $(me.pageId + " #messageItem");

          messageItemSelector.html( $.parseHTML( messageTemplate({message: message.toJSON()}) ) );

          if(messageItemSelector.hasClass('ui-listview'))
            messageItemSelector.listview('refresh');

          $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
        },
        error: function(collection, xhr){
          FlashMessage.success("Não foi possível carregar esse email");
        },
        complete: function() {
          $.mobile.loading("hide");
        }
      });
    },

    remove: function(event) {
      var me = this;
      if(event) event.preventDefault();

      Cache.Views.message.model.destroy({
        success: function(model, response){
          Cache.Views.message.model = null;
          $.mobile.navigate( "#folder?" + me.folderModel.idToUrl() );
          FlashMessage.success("Email removido com sucesso");
        },
        error: function(model, xhr){
          FlashMessage.success("Não foi possível remover esse email");
        }
      });
    }
  });

  return MessageView;
});
