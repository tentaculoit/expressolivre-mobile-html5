Ext.define('ExpressoMobile.store.Folders', {
    extend: 'Ext.data.Store',
    xtype: 'Folders',
    id: 'Folders',
    requires: ['ExpressoMobile.model.Folder'],
    
    config: {
    	model: 'ExpressoMobile.model.Folder',
    	autoLoad: false,
    	proxy: {
	        type: 'ajax',
            url: 'http://demo.expressolivre.org.br/api/rest/Mail/Folders',
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                destroy: 'POST'
            },
            extraParams: {
                id: 1,
                params: ''
            },
	        reader: {
		        type: 'json',
                rootProperty: 'result.folders'
		    }
    	}	
	}
});