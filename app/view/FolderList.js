Ext.define('ExpressoMobile.view.FolderList', {
    extend: 'Ext.List',
    xtype: 'folderList',
    id:'folderList',
    requires: ['ExpressoMobile.store.Folders'],
    
    config: {
    	loadingText: "Carregando Lista de Pastas...",
        emptyText: 'Nenhuma pasta encontrada',
        title: 'Pastas',
        itemTpl: '{folderName} {qtdMessages} / {qtdUnreadMessages} ',
        store: 'Folders',
        onItemDisclosure: true
    }
});