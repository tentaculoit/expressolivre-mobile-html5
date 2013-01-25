Ext.define('ExpressoMobile.model.User', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['auth', 'contactID', 'contactMails', 'contactPhones', 'contactFullName', 'contactApps'],
    }
});