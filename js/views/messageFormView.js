define(["backbone", "global", "cache", "flashMessage",
  "models/messageModel",
  "text!templates/messageFormBlock.html",
  "af"], function(Backbone, global, Cache, FlashMessage,
    MessageModel,
    messageFormBlockTemplate) {

  var MessageFormView = Backbone.View.extend({
    el: '#messageFormPage',
    pageId: '#messageFormPage',
    events: {
      'click #sendButton': 'send',
      'keyup #to': 'findContacts'
    },

    initialize: function() {
      var me = this;
      me.action = this.options.action;
      me.render();
    },

    render: function(){
      var me = this;
      var messageModel = me.getFormModel();

      if( me.action == "reply" || me.action == "forward" || me.action == "newFromEmail" )
        $(me.pageId + " a.backButton").attr("href","#message?" + messageModel.get("msgID"));
      else
        $(me.pageId + " a.backButton").attr("href","#folder?" + Cache.currentFolder.idToUrl());

      $(me.pageId + " #title").html( me.getTitle() );

      messageFormTemplate = _.template(messageFormBlockTemplate);

      var messageItemSelector = $(me.pageId + " #messageFormItem");

      messageItemSelector.html( $.parseHTML( messageFormTemplate({message: messageModel.toJSON()}) ) );

      if(messageItemSelector.hasClass('ui-listview')) {
        messageItemSelector.listview('refresh');
        $(me.pageId).trigger('create');
      }

      $.ui.loadContent(me.pageId);

    },

    getFormModel: function() {
      var me = this;
      var messageModel = new MessageModel();

      switch(me.action) {
        case "reply":
          messageModel.set("msgID", Cache.currentMessage.get("msgID"));
          messageModel.set("msgFrom", Cache.currentMessage.get("msgFrom"));
          messageModel.set("msgSubject", "Re: " + Cache.currentMessage.get("msgSubject"));
          messageModel.set("msgBody", Cache.currentMessage.get("msgBody"));

          break;
        case "forward":
          messageModel.set("msgID", Cache.currentMessage.get("msgID"));
          messageModel.set("msgSubject", "Fw: " + Cache.currentMessage.get("msgSubject"));
          messageModel.set("msgBody", Cache.currentMessage.get("msgBody"));

          break;
        case "newFromEmail":
          messageModel.set("msgID", Cache.currentMessage.get("msgID"));
      }

      return messageModel;
    },

    getTitle: function() {
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
      $.ui.showMask("Enviando Email...");

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
          FlashMessage.success("Email enviado com sucesso");
          $.mobile.navigate( "#folder?" + Cache.currentFolder.idToUrl() );
        },
        error: function(model, xhr){
          FlashMessage.error("Não foi possível enviar o email");
        },
        complete: function() {
          $.ui.hideMask("");
        }
      });
    },

    findContacts: function(event) {
      var filter = $(event.currentTarget).val();

      if( filter && filter.length > 2 ) {
          var findOptions = new ContactFindOptions( filter, true ); //true para retornar multiplos registros

          navigator.contacts.find(["displayName", "emails"],
            function (contacts) {
              console.log(contacts);
            },
            function (contactError) {
              console(contactError);
            }, findOptions
          );
        }
      }
  });

  return MessageFormView;
});
