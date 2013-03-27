define(["jquery"], function($) {

  var FlashMessage = {
    success: function(message) {
      this.show("success", message);
    },

    error: function(message) {
      this.show("error", message);
    },

    info: function(message) {
      this.show("info", message);
    },

    warning: function(message) {
      this.show("warning", message);
    },

    show: function (type, message) {
      $('<div><p>'+message+'</p></div>')
        .addClass(type + " flash-message")
        .css({ "display": "block", "top": $(window).scrollTop() })
        .appendTo( "body" )
        .delay( 1500 )
        .fadeOut( 400, function() {
          $(this).remove();
        })
    }
  }

  return FlashMessage;
});
