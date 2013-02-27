Ext.define('ExpressoMobile.store.Folders', {
    extend: 'Ext.data.Store',
    xtype: 'Folders',
    id: 'Folders',
    requires: [
        'ExpressoMobile.model.Folder',
        'ExpressoMobile.model.FolderSearch'
    ],

    constructor: function() {
        this.callParent(arguments);
        this.getProxy().setUrl(ExpressoMobile.app.serverUrl + "/api/rest/Mail/Folders");
        this.getProxy().setExtraParam('params', Ext.JSON.encode(Ext.create('ExpressoMobile.model.FolderSearch', {
            auth: ExpressoMobile.app.logedUser.result.auth
        })));
        this.getProxy().setExtraParam('id', 1);
    },

    config: {
        model: 'ExpressoMobile.model.Folder',
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
                rootProperty: 'result.folders'
            }
        }
    }
});
