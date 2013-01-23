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
	        url: 'http://demo.expressolivre.org/api/rest/Mail/Folders',
            actionMethods: {
                create: 'POST',
                read: 'POST',
                update: 'POST',
                delete: 'POST'
            },
            extraParams: {
                id: 1,
                params: "{\"auth\":\"5315b25f4b6307a26207bdd63f9a99ba:7b4492e4596194130bb6e9e9e4b64543\",\"folderID\":\"\",\"search\":\"\"}"
            },
	        reader: {
		        type: 'json',
                rootProperty: 'result.folders'
		    }
    	}	
	}
});