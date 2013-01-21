Ext.define('ExpressoMobile.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainForm',
    id:'mainForm',

    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Email',
                iconCls: 'compose',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Email',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Log Off',
                            itemId: 'logOffButton',
                            align: 'right'
                        }
                    ]
                },
                xtype:'folderList'
            },
            {
                title: 'Agenda',
                iconCls: 'team',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Agenda de Eventos',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Log Off',
                                itemId: 'logOffButton',
                                align: 'right'
                            }
                        ]
                    },
                    {
                        xtype: 'video',
                        url: 'http://av.vimeo.com/64284/137/87347327.mp4?token=1330978144_f9b698fea38cd408d52a2393240c896c',
                        posterUrl: 'http://b.vimeocdn.com/ts/261/062/261062119_640.jpg'
                    }
                ]
            },
            {
                title: 'Catálogo',
                iconCls: 'bookmarks',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Catálogo de Endereços',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Log Off',
                            itemId: 'logOffButton',
                            align: 'right'
                        }
                    ]
                },

                html: [
                    "You've just generated a new Sencha Touch 2 project. What you're looking at right now is the ",
                    "contents of <a target='_blank' href=\"app/view/Main.js\">app/view/Main.js</a> - edit that file ",
                    "and refresh to change what's rendered here."
                ].join("")
            }
        ],
        listeners: [{
            delegate: '#logOffButton',
            event: 'tap',
            fn: 'onLogOffButtonTap'
        }]
    },
    onLogOffButtonTap: function () {
        this.fireEvent('signOffCommand');
    }
});
