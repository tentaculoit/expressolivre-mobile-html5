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
    onSignInCommand: function (view, username, password) {
    	var me = this;
    	console.log('Username: ' + username + '\n' + 'Password: ' + password);
    	if (username.length === 0 || password.length === 0) {
    		me.singInFailure('Usuário e Senha são obrigatórios');
    		return;
		}
        var json = Ext.JSON.encode("user:"+username);
        console.log(json);
    	view.setMasked({
	        xtype: 'loadmask',
	        message: 'Autenticando...'
    	});
        Ext.Ajax.request({
            url: 'http://demo.expressolivre.org/api/rest/Login',
            method: 'POST',
            timeout: 5000,
            params: {
                id:1,
                params:"{\"user\":\"demo\",\"password\":\"demo22\"}"
            },
            success: function (response) {

                /*var loginResponse = Ext.JSON.decode(response.responseText);

                if (loginResponse.success === "true") {
                    // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
                    me.sessionToken = loginResponse.sessionToken;
                    me.signInSuccess();     //Just simulating success.
                } else {
                    me.singInFailure(loginResponse.message);
                }*/
                view.setMasked(false);
                me.signInSuccess();
            },
            failure: function (response) {
                view.setMasked(false);
                me.sessionToken = null;
                me.singInFailure('Login failed. Please try again later.');
            }
        });
    	// realizar o processo de autenticação
    	/*var task = Ext.create('Ext.util.DelayedTask', function () {
            view.setMasked(false);
    		me.signInSuccess();
        });
    	task.delay(1000);*/
    },
    onSignOffCommand: function () {
    	Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
	},
    signInSuccess: function () {
    	Ext.Viewport.animateActiveItem(Ext.getCmp('mainForm'),{ type: 'slide', direction: 'left' });
	},
	singInFailure: function (message) {
		Ext.Msg.alert('Falha de Login', message, Ext.emptyFn);
	}
});