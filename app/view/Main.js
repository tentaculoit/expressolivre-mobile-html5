Ext.define("ExpressoMobile.view.Main", {
  extend: 'Ext.ux.slidenavigation.View',
  id:'mainView',

  requires: [
    'Ext.Container',
    'Ext.MessageBox',
    'Ext.Panel',
    'Ext.Toolbar',
    'Ext.TitleBar',
    'Ext.event.publisher.Dom',
    'ExpressoMobile.model.MailSearch',
    'ExpressoMobile.store.Folders',
    'ExpressoMobile.store.Mails'
  ],

  logOffButton: {
    xtype: 'button',
    text: 'Logout',
    itemId: 'logoutButton',
    align: 'right'
  },

  initialize: function() {
    var me = this;
    var folderStore = Ext.getStore('Folders');

    items = [];

    items.push({
      title: 'Agenda',
      group: 'Módulos',
      slideButton: true,
      items: [{
        xtype: 'titlebar',
        title: 'Agenda',
        docked: 'top',
        items: [me.logOffButton],
      },{
        xtype: 'panel',
        maskOnOpen: true
      }]
    });

    items.push({
      title: 'Contatos',
      group: 'Módulos',
      slideButton: true,
      items: [{
        xtype: 'titlebar',
        title: 'Contatos',
        docked: 'top',
        items: [me.logOffButton]
      },{
        xtype: 'panel',
        maskOnOpen: true
      }]
    });

    folderStore.each(function(item, index, totalItems ) {
      var store = Ext.create('ExpressoMobile.store.Mails');

      store.getProxy().setExtraParam('params',
        Ext.encode(
          Ext.create('ExpressoMobile.model.MailSearch', {
            folderID: item.get('folderID') }
            // auth: ExpressoMobile.app.logedUser.result.auth }
          ).getData()
        )
      );

      store.load();

      var mailList = Ext.create('ExpressoMobile.view.MailList', {
        store: store
      });

      items.push({
        title: item.get('folderName'),
        group: 'Pastas',
        slideButton: true,
        items: [{
          xtype: 'titlebar',
          title: item.get('folderName'),
          docked: 'top',
          items: [me.logOffButton]
        },
          mailList
        ]
      })
    })

    this.addItems(items);
    this.callParent(arguments);
  },

  config: {
    container: {
      id:'mainContainerView',
      xtype: 'mainContainerView',
      listeners: [{
        delegate: '#logoutButton',
        event: 'tap',
        fn: function(btn) {
          this.fireEvent('logout');
        }
      }]
    },

    fullscreen: true,

    /**
     *  Any component within the container with an 'x-toolbar' class
     *  will be draggable.  To disable draggin all together, set this
     *  to false.
     */
    slideSelector: 'x-titlebar',

    /**
     *  Container must be dragged 10 pixels horizontally before allowing
     *  the underlying container to actually be dragged.
     *
     *  @since 0.2.2
     */
    containerSlideDelay: 10,

    /**
     *  Time in milliseconds to animate the closing of the container
     *  after an item has been clicked on in the list.
     */
    selectSlideDuration: 200,

    /**
     *  Enable content masking when container is open.
     *
     *  @since 0.2.0
     */
    itemMask: true,

    /**
     *  Define the default slide button config.  Any item that has
     *  a `slideButton` value that is either `true` or a button config
     *  will use these values at the default.
     */
    slideButtonDefaults: {
      selector: 'titlebar'
    },

    /**
     *  This allows us to configure how the actual list container
     *  looks.  Here we've added a custom search field and have
     *  modified the width.
     */
    list: {
      maxDrag: 400,
      width: 200,
      items: [{
        xtype: 'toolbar',
        docked: 'top',
        ui: 'light',
        title: {
          title: 'Menu',
          centered: false,
          width: 200,
          left: 0
        }
      }]
    },

    /**
     *  Change this to 'right' to dock the navigation list to the right.
     */
    listPosition: 'left',

    /**
     *  These are the default values to apply to the items within the
     *  container.
     */
    defaults: {
      style: 'background: #fff',
      xtype: 'container'
    }
  }
});
