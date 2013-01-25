Ext.define('ExpressoMobile.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
		'Ext.util.DelayedTask',
        'ExpressoMobile.model.FolderSearch',
        'ExpressoMobile.store.Folders'
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

                var loginResponse = Ext.JSON.decode(response.responseText);

                view.setMasked(false);

                if (loginResponse.error) {
                   me.singInFailure(loginResponse.error.message); 
                } else {
                    me.sessionToken=loginResponse.result.auth;
                    me.signInSuccess();
                }
            },
            failure: function (response) {
                view.setMasked(false);
                me.sessionToken = null;
                me.singInFailure('Problemas ao conectar o servidor '+ExpressoMobile.app.serverUrl);
            }
        });
    },
    onSignOffCommand: function () {
        var urlLogout = ExpressoMobile.app.serverUrl+"/api/rest/Logout";
        console.log(urlLogout);

        //Alterar para o model de usuário qdo criado, usando o foldersearch apenas pela variavel auth
        var folderSearch = Ext.create('ExpressoMobile.model.FolderSearch', {
            auth:this.sessionToken,
        });
        Ext.Ajax.request({
            url: urlLogout,
            method: 'POST',
            timeout: 5000,
            params: {
                id:1,
                params:Ext.JSON.encode(folderSearch)
            },
            success: function (response) {

                /*var loginResponse = Ext.JSON.decode(response.responseText);

                view.setMasked(false);

                if (loginResponse.error) {
                   me.singInFailure(loginResponse.error.message); 
                } else {
                    me.sessionToken=loginResponse.result.auth;
                    me.signInSuccess();
                }*/
                Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
            },
            failure: function (response) {
                me.singInFailure('Problemas ao conectar o servidor '+ExpressoMobile.app.serverUrl);
            }
        });    	
	},
    signInSuccess: function () {
        var folderStore = Ext.getStore('Folders');
        console.log(folderStore);
        console.log(this.sessionToken);
        var folderSearch = Ext.create('ExpressoMobile.model.FolderSearch', {
            auth:this.sessionToken,
        });
        folderStore.getProxy().setUrl(ExpressoMobile.app.serverUrl+"/api/rest/Mail/Folders");
        folderStore.getProxy().setExtraParam('params', Ext.JSON.encode(folderSearch));        
        folderStore.load();
    	Ext.Viewport.animateActiveItem(Ext.getCmp('mainForm'),{ type: 'slide', direction: 'left' });
	},
	singInFailure: function (message) {
		Ext.Msg.alert('Falha de Login', message, Ext.emptyFn);
	}
});