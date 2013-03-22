define(["jquery", "backbone", "global",
  "models/messageModel",
  "text!templates/messageFormBlock.html"], function($, Backbone, global, MessageModel, messageFormBlockTemplate) {

  var MessageView = Backbone.View.extend({
    el: '#messageFormPage',
    pageId: '#messageFormPage',
    events: {
      'click #sendButton': 'send'
    },

    initialize: function() {
      var me = this;
      me.folderModel = this.options.folderModel;
      me.action = this.options.action;
      me.render();
    },

    render: function(){
      var me = this;

      if( me.action == "reply" || me.action == "forward" || me.action == "newFromEmail" )
        $(me.pageId + " a.backButton").attr("href","#message?" + me.model.get("msgID"));
      else
        $(me.pageId + " a.backButton").attr("href","#folder?" + me.folderModel.idToUrl());

      $(me.pageId + " #title").html(me.actionToTitle());

      messageFormTemplate = _.template(messageFormBlockTemplate);

      var messageItemSelector = $(me.pageId + " #messageFormItem");

      messageItemSelector.html( $.parseHTML( messageFormTemplate({message: me.model.toJSON()}) ) );

      if(messageItemSelector.hasClass('ui-listview')) {
        messageItemSelector.listview('refresh');
        $(me.pageId).trigger('create');
      }

      $.mobile.changePage( me.pageId, { reverse: false, changeHash: false } );

    },

    actionToTitle: function() {
      switch(this.action) {
      case "reply":
        return "Responder";
      case "forward":
        return "Encaminhar";
      case "new":
        return "Novo Email";
      case "newFromEmail":
        return "Novo Email";
      default:
        return "";
      }
    },

    send: function(event){
      var me = this;
      if(event) event.preventDefault();
      $.mobile.loading("show", { text: "Enviando Email", textVisible: true });

      var bodyToReplyOrForward = $('#bodyToReplyOrForward').html();
      if(bodyToReplyOrForward != "") bodyToReplyOrForward = "<br><br>" + bodyToReplyOrForward;

      var message = new MessageModel( {
        msgTo: $('#to').val(),
        msgCC: "",
        msgBcc: "",
        msgSubject: $('#subject').val(),
        msgType: "text/html",
        msgBody: $('#body').val() + bodyToReplyOrForward } );

      message.save(null,{
        success: function(model, response){
          $.mobile.navigate( "#folder?" + me.folderModel.idToUrl() );
        },
        error: function(model, xhr){
          console.log(xhr)
        },
        complete: function() {
          $.mobile.loading("hide");
        }
      });
    }
  });

  return MessageView;
});
