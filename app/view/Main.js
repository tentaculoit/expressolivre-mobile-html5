Ext.define("ExpressoMobile.view.Main", {
    id:'mainForm',
    extend: 'Ext.ux.slidenavigation.View',

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
        text: 'Log Off',
        itemId: 'logOffButton',
        align: 'right'
    },

    onLogOffButtonTap: function () {
        var me = this;

        me.fireEvent('signOffCommand');
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
                items: [me.logOffButton]
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
                }, mailList
                    // xtype: 'mailList',
                    // config: { proxy: { extraParam: { params: Ext.JSON.encode(Ext.create('ExpressoMobile.model.MailSearch', {
                    //     auth: ExpressoMobile.app.logedUser.result.auth
                    // } ) ) } } }
                    // maskOnOpen: true
                ]
            })
        })

        this.addItems(items);
        this.callParent(arguments);
    },

    config: {
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
        },

        listeners: [{
            delegate: '#logOffButton',
            event: 'tap',
            fn: 'onLogOffButtonTap'
        }]
    }
});










// Ext.define('ExpressoMobile.view.Main', {
//     extend: 'Ext.ux.slidenavigation.View',
//     xtype: 'mainForm',
//     id:'mainForm',

//     requires: [
//         'Ext.TitleBar',
//         'Ext.Video'
//     ],
//     config: {
//         tabBarPosition: 'bottom',

//         items: [
//             {
//                 title: 'Email',
//                 iconCls: 'compose',

//                 styleHtmlContent: true,
//                 scrollable: true,

//                 items: {
//                     docked: 'top',
//                     xtype: 'titlebar',
//                     title: 'Email',
//                     items: [
//                         {
//                             xtype: 'button',
//                             text: 'Log Off',
//                             itemId: 'logOffButton',
//                             align: 'right'
//                         }
//                     ]
//                 },
//                 xtype:'folderList'
//             },
//             {
//                 title: 'Agenda',
//                 iconCls: 'team',

//                 items: [
//                     {
//                         docked: 'top',
//                         xtype: 'titlebar',
//                         title: 'Agenda de Eventos',
//                         items: [
//                             {
//                                 xtype: 'button',
//                                 text: 'Log Off',
//                                 itemId: 'logOffButton',
//                                 align: 'right'
//                             }
//                         ]
//                     },
//                     {
//                         xtype: 'video',
//                         url: 'http://av.vimeo.com/64284/137/87347327.mp4?token=1330978144_f9b698fea38cd408d52a2393240c896c',
//                         posterUrl: 'http://b.vimeocdn.com/ts/261/062/261062119_640.jpg'
//                     }
//                 ]
//             },
//             {
//                 title: 'Catálogo',
//                 iconCls: 'bookmarks',

//                 styleHtmlContent: true,
//                 scrollable: true,

//                 items: {
//                     docked: 'top',
//                     xtype: 'titlebar',
//                     title: 'Catálogo de Endereços',
//                     items: [
//                         {
//                             xtype: 'button',
//                             text: 'Log Off',
//                             itemId: 'logOffButton',
//                             align: 'right'
//                         }
//                     ]
//                 },

//                 html: [
//                     "You've just generated a new Sencha Touch 2 project. What you're looking at right now is the ",
//                     "contents of <a target='_blank' href=\"app/view/Main.js\">app/view/Main.js</a> - edit that file ",
//                     "and refresh to change what's rendered here."
//                 ].join("")
//             }
//         ],
//         listeners: [{
//             delegate: '#logOffButton',
//             event: 'tap',
//             fn: 'onLogOffButtonTap'
//         }]
//     },
//     onLogOffButtonTap: function () {
//         this.fireEvent('signOffCommand');
//     }
// });
