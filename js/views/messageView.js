define(["jquery", "backbone", "global", "models/messageModel"], function($, Backbone, global, MessageModel) {

  var MessageView = Backbone.View.extend({
    pageId: '#messagePage',
    events: {
    },

    initialize: function() {
      var me = this;
      me.folderModel = this.options.folderModel;
      me.render();
    },

    render: function(){
      var me = this;
      $.mobile.loading("show", { text: "Carregando Email", textVisible: true });

      me.model.fetch({
        success: function(message){

          messageTemplate = _.template($('#message-template').html());
          $(me.pageId + " div:jqmData(role='content')").html( $.parseHTML( messageTemplate({message: message.toJSON()}) ) );
          $(me.pageId + " a.backButton").attr("href","#folder?" + me.folderModel.idToUrl());
        },
        error: function(collection, xhr){
          console.log(xhr)
        },
        complete: function() {
          $.mobile.loading("hide");
          $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );
        }
      });
    }
  });

  return MessageView;
});
