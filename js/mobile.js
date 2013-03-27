// Sets the require.js configuration for your application.
require.config( {
  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
  paths: {
    // Core Libraries
    "jquery": "libs/jquery",
    "jquerymobile": "libs/jquerymobile",
    "underscore": "libs/lodash",
    "backbone": "libs/backbone",
    "text": "libs/text",
    "cordova": "libs/cordova"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
    "backbone": {
      "deps": [ "underscore", "jquery" ],
      "exports": "Backbone"  //attaches "Backbone" to the window object
    }
  } // end Shim Configuration
} );

// Includes File Dependencies
require([ "jquery", "backbone", "routers/mobileRouter", "global", "flashMessage" ], function( $, Backbone, Mobile, global, FlashMessage ) {
  $( document ).on( "mobileinit",
    // Set up the "mobileinit" handler before requiring jQuery Mobile's module
    function() {
      $.mobile.allowCrossDomainPages = true;
      $.support.cors = true;
      // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
      $.mobile.linkBindingEnabled = false;
      // Disabling this will prevent jQuery Mobile from handling hash changes
      $.mobile.hashListeningEnabled = false;

      // // Navigation
      $.mobile.page.prototype.options.backBtnText = "Voltar";
      // $.mobile.page.prototype.options.addBackBtn      = true;
      // $.mobile.page.prototype.options.backBtnTheme    = "d";

      // // Page
      // $.mobile.page.prototype.options.headerTheme   = "b";  // Page header only
      // $.mobile.page.prototype.options.contentTheme  = "d";
      // $.mobile.page.prototype.options.footerTheme   = "b";

      // // Listviews
      // $.mobile.listview.prototype.options.headerTheme     = "a";  // Header for nested lists
      // $.mobile.listview.prototype.options.theme           = "b";  // List items / content
      // $.mobile.listview.prototype.options.dividerTheme    = "d";  // List divider

      // $.mobile.listview.prototype.options.splitTheme   = "c";
      // $.mobile.listview.prototype.options.countTheme   = "c";
      // $.mobile.listview.prototype.options.filterTheme = "c";
      // $.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
    }
  )

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

  require( [ "jquerymobile" ], function() {
    // Instantiates a new Backbone.js Mobile Router
    this.router = new Mobile();
  });
} );
