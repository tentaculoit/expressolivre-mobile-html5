Ext.define('ExpressoMobile.store.Mails', {
    extend: 'Ext.data.Store',
    xtype: 'Mails',
    requires: [
        'ExpressoMobile.model.Mail',
        'ExpressoMobile.model.MailSearch'
    ],

    constructor: function() {
        this.callParent(arguments);
        this.getProxy().setUrl(ExpressoMobile.app.serverUrl + "/api/rest/Mail/Messages");
        this.getProxy().setExtraParam('id', 1);
    },

    config: {
      model: 'ExpressoMobile.model.Mail',
      autoLoad: false,
      proxy: {
          type: 'ajax',
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            },
          reader: {
            type: 'json',
                rootProperty: 'result.messages'
        }
      }
  }
});
