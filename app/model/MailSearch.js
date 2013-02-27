Ext.define('ExpressoMobile.model.MailSearch', {
    extend: 'Ext.data.Model',
    config: {
      fields: [
        {name: 'auth',  type: 'string'},
        {name: 'folderID',   type: 'string', defaultValue: 'INBOX' },
        {name: 'search', type: 'string'},
        {name: 'resultsPerPage', type: 'int', defaultValue: 10},
        {name: 'page', type: 'int', defaultValue: 1}
      ]
    }
});
