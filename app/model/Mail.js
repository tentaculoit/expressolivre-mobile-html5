Ext.define('ExpressoMobile.model.Mail', {
    extend: 'Ext.data.Model',
    config: {
      fields: ['msgID', 'folderID', 'msgDate', 'msgSubject', 'msgHasAttachments', 'msgFlagged',
       'msgForwarded', 'msgAnswered', 'msgDraft', 'msgSeen', 'ContentType', 'msgSize', 'msgBodyResume',
       {name: 'from', mapping: 'msgFrom' },
       {name: 'to', mapping: 'msgTo', convert:
          function(value, record) { //fullName, mailAddress
            if (value) {
              if (value instanceof Array) {
                return value;
              } else {
                return [value]; // Convert to an Array
              }
            }

            return value;
          }
        }
      ]
    }
});




// {
//   "id": "1",
//   "result": {
//     "messages": [
//       {
//         "msgID": 326,
//         "folderID": "INBOX",
//         "msgDate": "19/02/2013 15:41",
//         "msgFrom": {
//           "fullName": "Usuario de Demonstracao",
//           "mailAddress": "demo@demo.expressolivre.org"
//         },
//         "msgTo": [
//           {
//             "fullName": "Usuario 777",
//             "mailAddress": "demo@demo.expressolivre.org"
//           }
//         ],
//         "msgReplyTo": [
//           {
//             "fullName": "Usuario de Demonstracao ",
//             "mailAddress": "demo@demo.expressolivre.org"
//           }
//         ],
//         "msgSubject": "Teste Filtro",
//         "msgHasAttachments": "0",
//         "msgFlagged": "1",
//         "msgForwarded": "0",
//         "msgAnswered": "0",
//         "msgDraft": "0",
//         "msgSeen": "1",
//         "ContentType": "normal",
//         "msgSize": "1002",
//         "msgBodyResume": "Teste filtro_________________________________________________Usuário de teste do Expresso Mail"
//       },

