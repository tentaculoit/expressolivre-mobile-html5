Ext.define('ExpressoMobile.model.Folder', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['folderName', 'folderParentID', 'folderHasChildren', 'qtdUnreadMessages', 'qtdMessages', 'folderID', 'folderType', 'diskSizeUsed', 'diskSizePercent'],
    }
});