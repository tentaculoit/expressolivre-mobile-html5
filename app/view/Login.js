Ext.define("ExpressoMobile.view.Login", {
	extend: 'Ext.form.Panel',
	xtype: 'loginForm',
	id: 'loginForm',

	requires: [
		'Ext.field.Toggle',
		'Ext.form.FieldSet',
		'Ext.field.Password'
	],

	config: {
		title: 'loginForm',
		iconCls: 'user',
		items: [
			{
				xtype: 'fieldset',
				iconCls: 'home',
				defaults: {
					labelWidth: '40%'
				},
				instructions: '(Informe suas credenciais)',

				items: [
					{
						xtype: "toolbar",
						dock: "top",
						title: "Expresso Mobile"
					},
					{
						xtype: 'textfield',
						id: 'userNameTextField',
						name : 'userNameTextField',
						label: 'Usuário',
						value: 'demo',
						allowBlank:false,
						required: true
					},
					{
						xtype: 'passwordfield',
						id: 'passwordTextField',
						name : 'passwordTextField',
						label: 'Senha',
						value: 'demo22',
					 	required: true
					},
					{
						xtype: 'textfield',
						id: 'serverurl',
						name : 'server',
						label: 'Servidor',
						value: 'http://demo.expressolivre.org'
					},
					{
						xtype: 'togglefield',
						label: 'Lembrar Usuário',
						labelWidth: '60%',
						name: 'keepUser'
					}
				]

			},
			{
				xtype: 'button',
				text: 'Log in',
				id: 'logInButton',
				ui: 'action',
				padding: '10px'

			}
		],
		listeners: [{
		    delegate: '#logInButton',
		    event: 'tap',
		    fn: 'onLogInButtonTap'
		}]
	},
	onLogInButtonTap: function () {
		var me = this,
		usernameField = me.down('#userNameTextField'),
        passwordField = me.down('#passwordTextField'),
        username = usernameField.getValue(),
        password = passwordField.getValue();
		me.fireEvent('signInCommand', me, username, password);
	}
});
