Ext.define('ExpressoMobile.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
		'Ext.util.DelayedTask',
        'ExpressoMobile.model.FolderSearch',
        'ExpressoMobile.store.Folders',
        'ExpressoMobile.model.User',
        'ExpressoMobile.view.Main'
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
        Ext.Viewport.setMasked({xtype:'loadmask',message:'Carregando módulos'});

        var folderStore = Ext.create('ExpressoMobile.store.Folders');
        var mailStore = Ext.create('ExpressoMobile.store.Mails');

        folderStore.load(function(records, operation, success) {
            Ext.Viewport.add(Ext.create('ExpressoMobile.view.Main'));
            Ext.Viewport.animateActiveItem(Ext.getCmp('mainForm'),{ type: 'slide', direction: 'left' });
            Ext.Viewport.setMasked(false);
        }, this);
    },
    singInFailure: function (message) {
		Ext.Msg.alert('Falha de Login', message, Ext.emptyFn);
	},
    singOffSucess: function () {
        ExpressoMobile.app.invalidateSession();
        Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
    }
});
