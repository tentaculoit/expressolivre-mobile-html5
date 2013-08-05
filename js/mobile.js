// Sets the require.js configuration for your application.
require.config( {
  paths: {
    // Core Libraries
    "domReady": "libs/domReady",
    "af": "libs/appframework",
    "afui": "libs/appframework.ui",
    "underscore": "libs/lodash",
    "backbone": "libs/backbone",
    "text": "libs/text",
    "cordova": "libs/cordova"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
    "backbone": {
      "deps": [ "underscore", "af" ],
      "exports": "Backbone"  //attaches "Backbone" to the window object
    },
  } // end Shim Configuration
} );

require([ "backbone", "routers/mobileRouter", "global", "flashMessage", "af", "afui"], function( Backbone, Mobile, global, FlashMessage) {

  var isPhoneGap = function() {
    return (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) && document.location.protocol == "file:")
  }

  var onDeviceReady = function() {
    console.log("dom and device ready : we can start...");

    $.ui.showBackbutton=false
    $.ui.loadDefaultHash = false;
    $.ui.manageHistory = false;
    $.ui.autoLaunch = false;
    $.ui.useOSThemes = true;
    $.ui.blockPageScroll();

    $.ui.launch();

    this.router = new Mobile();
    this.router.navigate = function (url) {window.location = url; }

    // Tells Backbone to start watching for hashchange events
    Backbone.history.start({pushState: false})
    this.router.navigate("#login");
  }


  require(['domReady','cordova'], function (domReady) {
    domReady(function () {
      console.log("The DOM is ready - waiting for the device");

      if (isPhoneGap()) {
        document.addEventListener("deviceready", onDeviceReady, false);
      } else {
        onDeviceReady(); //this is the browser
      }
    });
  });

  //afui launched and is ready
  $.ui.ready(function () {
    if($.ui.useOSThemes && !$.os.ios&&$("#afui").get(0).className !== "ios")
    $("#afui").removeClass("ios");
  });

  Backbone.Model.prototype.sync = function(method, model, options) {
    options = options ? _.clone(options) : {};
    options.contentType='application/json';

    model.set({auth: global.app.auth});
    options.data = "params=" + JSON.stringify(model.attributes);

    if (model.methodUrl && model.methodUrl(method.toLowerCase())) {
      methodUrl = model.methodUrl(method.toLowerCase());
      options.url = methodUrl.url;
      options.method = methodUrl.method;
    }

    Backbone.sync(method, model, options);
  };

  Backbone.Model.prototype.hasError = function() {
    return (this.get("error"));
  }

  Backbone.Model.prototype.parse = function (response) {
    //Não faz sempre o parse do result pois quando da um fetch em uma collection
    //é chamado o parse da collection para preencher a collection porém chama também
    //o parse do Model para cada item dentro da collection
    if( _.isObject(response.error) ) {
      if( response.error.code )
        FlashMessage.serverError( response.error.code );
      return response;
    } else {
      if ( _.isObject(response.result) ) {
        return response.result;
      } else {
        return response;
      }
    }
  };
} );

