Ext.define('ExpressoMobile.store.Folders', {
    extend: 'Ext.data.Store',
    requires: ['ExpressoMobile.model.Folder'],
    
    config: {
    	model: 'ExpressoMobile.model.Folder',
    	autoLoad: true,
    	proxy: {
	        type: 'ajax',
	        url: 'data/folders.json',
	        reader: {
		        type: 'json'
		    }
    	}	
	}
});