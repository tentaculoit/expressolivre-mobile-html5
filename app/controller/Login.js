Ext.define('ExpressoMobile.controller.Login', {
  extend: 'Ext.app.Controller',
  requires: [
    'Ext.util.DelayedTask'
  ],
  config: {
    refs: {
      mainContainerView: '#mainContainerView',
      loginForm: '#loginForm'
    },
    control: {
      loginForm: {
        login: 'doLogin'
      },
      mainContainerView: {
        logout: 'doLogout'
      }
    }
  },

  doLogin: function (view, values) {
    var me = this;
    ExpressoMobile.app.serverUrl = values.serverurl;
    var urlLogin = ExpressoMobile.app.serverUrl + "/api/rest/Login";

    if (values.user.length === 0 || values.password.length === 0) {
      me.loginFailure('Usuário e Senha são obrigatórios');
      return;
    }

    Ext.Viewport.setMasked({xtype:'loadmask', message:'Autenticando'});

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
        Ext.Viewport.setMasked(false);

        if (ExpressoMobile.app.logedUser.error) {
             me.loginFailure(ExpressoMobile.app.logedUser.error.message);
        } else {
          me.loginSuccess();
        }
      },
      failure: function (response) {
        view.setMasked(false);
        ExpressoMobile.app.invalidateSession();
        me.loginFailure('Problemas ao conectar o servidor ' + ExpressoMobile.app.serverUrl);
      }
    });
  },

  doLogout: function () {
    var me = this;
    var urlLogout = ExpressoMobile.app.serverUrl + "/api/rest/Logout";

    var user = Ext.create('ExpressoMobile.model.User', {
      auth: ExpressoMobile.app.logedUser.result.auth,
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
        me.logoutSucess();
      },
      failure: function (response) {
        me.logoutFailure('Problemas ao conectar o servidor ' + ExpressoMobile.app.serverUrl);
      }
    });
  },

  loginSuccess: function () {
    Ext.Viewport.setMasked({xtype:'loadmask', message:'Carregando módulos'});

    var folderStore = Ext.create('ExpressoMobile.store.Folders');
    var mailStore = Ext.create('ExpressoMobile.store.Mails');

    folderStore.load(function(records, operation, success) {
      Ext.Viewport.add(Ext.create('ExpressoMobile.view.Main'));
      Ext.Viewport.animateActiveItem(Ext.getCmp('mainView'),{ type: 'slide', direction: 'left' });
      Ext.Viewport.setMasked(false);
    }, this);
  },

  loginFailure: function (message) {
    Ext.Msg.alert('Falha no Login', message, Ext.emptyFn);
  },

  logoutSucess: function () {
    ExpressoMobile.app.invalidateSession();
    Ext.Viewport.animateActiveItem(Ext.getCmp('loginForm'), { type: 'pop' });
  },

  logoutFailure: function (message) {
    Ext.Msg.alert('Falha no Logout', message, Ext.emptyFn);
  }
});
