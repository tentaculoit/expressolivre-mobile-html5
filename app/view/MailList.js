Ext.define('ExpressoMobile.view.MailList', {
    extend: 'Ext.List',
    xtype: 'mailList',
    requires: ['ExpressoMobile.store.Mails'],

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
                var mailView = Ext.getCmp('mailView');

                if(mailView) {
                    Ext.getCmp('mailViewPanel').setHtml(record.get('msgSubject'));
                    Ext.Viewport.animateActiveItem(mailView,{ type: 'slide', direction: 'left' });
                } else {
                    Ext.Viewport.add(Ext.create('Ext.Container', {
                        id: "mailView",
                        control: {
                          '#backButton' : {
                            tap: function(btn) {
                              Ext.Viewport.animateActiveItem(Ext.getCmp('mainView'),{ type: 'slide', direction: 'right' });
                            }
                          }
                        },
                        items: [{
                            docked: 'top',
                            xtype: 'titlebar',
                            items: [{
                                xtype: 'button',
                                text: 'Voltar',
                                itemId: 'backButton'
                            }]
                        }, {
                            xtype: 'panel',
                            id: 'mailViewPanel',
                            html: record.get('msgSubject')
                        }]
                    }));
                    Ext.Viewport.animateActiveItem(Ext.getCmp('mailView'),{ type: 'slide', direction: 'left' });
                }
            }
        }
    }
});
