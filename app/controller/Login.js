Ext.define('ExpressoMobile.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
		'Ext.util.DelayedTask',
        'ExpressoMobile.model.FolderSearch',
        'ExpressoMobile.store.Folders',
        'ExpressoMobile.model.User'
	],
    config: {
        refs: {
            loginView: 'loginForm',
            mainMenuView: 'mainForm'
        },
        control: {
            loginView: {
                signInCommand: 'onSignInCommand'
            },
	        mainMenuView: {
	            signOffCommand: 'onSignOffCommand'
	        }
        }
    },
    onSignInCommand: function (view) {
    	var me = this;
        ExpressoMobile.app.serverUrl=view.down('#serverurl').getValue();
        var urlLogin = ExpressoMobile.app.serverUrl+"/api/rest/Login";
        console.log(urlLogin);
    	if (view.down('#user').getValue().length === 0 || view.down('#password').getValue().length === 0) {
    		me.singInFailure('Usuário e Senha são obrigatórios');
    		return;
		}
    	view.setMasked({
	        xtype: 'loadmask',
	        message: 'Autenticando...'
    	});
        Ext.Ajax.request({
            url: urlLogin,
            method: 'POST',
            timeout: 5000,
            params: {
                id:1,
                params:Ext.JSON.encode(view.getValues())
            },
            success: function (response) {

                ExpressoMobile.app.logedUser = Ext.JSON.decode(response.responseText);
                console.log(ExpressoMobile.app.logedUser);
                view.setMasked(false);

                if (ExpressoMobile.app.logedUser.error) {
                   me.singInFailure(ExpressoMobile.app.logedUser.error.message); 
                } else {
                    me.signInSuccess();
                }
            },
            failure: function (response) {  
                view.setMasked(false);
                ExpressoMobile.app.invalidateSession();
                me.singInFailure('Problemas ao conectar o servidor '+ExpressoMobile.app.serverUrl);
            }
        });
    },
    onSignOffCommand: function () {
        var me = this;
        var urlLogout = ExpressoMobile.app.serverUrl+"/api/rest/Logout";
        console.log(urlLogout);

        var user = Ext.create('ExpressoMobile.model.User', {
            auth:ExpressoMobile.app.logedUser.result.auth,
        });
        Ext.Ajax.request({
            url: urlLogout,
            method: 'POST',
            timeout: 5000,
            params: {
                id:1,
                params:Ext.JSON.encode(user)
            },
            success: function (response) {
                me.singOffSucess();
            },
            failure: function (response) {
                me.singInFailure('Problemas ao conectar o servidor '+ExpressoMobile.app.serverUrl);
            }
        });    	
	},
    signInSuccess: function () {
        var folderStore = Ext.getStore('Folders');
        var folderSearchUrl = ExpressoMobile.app.serverUrl+"/api/rest/Mail/Folders";
        console.log(folderStore);
        console.log(ExpressoMobile.app.logedUser.result.auth);
        console.log(folderSearchUrl);
        var folderSearch = Ext.create('ExpressoMobile.model.FolderSearch', {
            auth:ExpressoMobile.app.logedUser.result.auth,
        });
        folderStore.getProxy().setUrl(folderSearchUrl);
        folderStore.getProxy().setExtraParam('params', Ext.JSON.encode(folderSearch));        
        folderStore.load();
    	Ext.Viewport.animateActiveItem(Ext.getCmp('mainForm'),{ type: 'slide', direction: 'left' });
	},
	singInFailure: function (message) {
		Ext.Msg.alert('Falha de Login', message, Ext.emptyFn);
	},
    singOffSucess: function () {
        ExpressoMobile.app.invalidateSession();
        Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
    }
});