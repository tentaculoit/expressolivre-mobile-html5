Ext.define('ExpressoMobile.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
		'Ext.util.DelayedTask'
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
        var urlLogin = view.down('#serverurl').getValue()+"/api/rest/Login";
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
                me.singInFailure('Problemas ao conectar o servidor '+view.down('#serverurl').getValue());
            }
        });
    },
    onSignOffCommand: function () {
    	Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
	},
    signInSuccess: function () {
        Ext.getStore('Folders').load();
        console.log(Ext.getStore('Folders'));
    	Ext.Viewport.animateActiveItem(Ext.getCmp('mainForm'),{ type: 'slide', direction: 'left' });
	},
	singInFailure: function (message) {
		Ext.Msg.alert('Falha de Login', message, Ext.emptyFn);
	}
});