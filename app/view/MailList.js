Ext.define('ExpressoMobile.view.MailList', {
    extend: 'Ext.List',
    xtype: 'mailList',
    requires: ['ExpressoMobile.store.Mails'],

    // initialize: function() {
    //     this.callParent(arguments);

    //     var mailStore = Ext.getStore('Mails');
    //     mailStore.load();
    // },

    config: {
        loadingText: "Carregando Lista de Emails...",
        emptyText: 'Nenhum email encontrado',
        title: 'Emails',
        itemTpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<tpl if="this.isSentFolder(folderID)">',
                    '<tpl for="to">',
                        '<p><b>{[this.renderLabel(values.fullName,values.mailAddress)]}</b></p>',
                    '</tpl>',
                '<tpl else>',
                    '<p><b>{[this.renderLabel(values.from.fullName,values.from.mailAddress)]}</b></p>',
                '</tpl>',
                '<p>{msgSubject}</p>',
            '</tpl>',
            {
                isSentFolder: function(folderId) {
                    return folderId === "INBOX/Enviados"
                },
                renderLabel: function(name, email) {
                    return (name) ? name : email
                }
            }
        ),
        onItemDisclosure: true,
        listeners: {
            itemsingletap: function (list, idx, target, record, evt) {
                console.log(record.data)
            }
        }
    }
});
