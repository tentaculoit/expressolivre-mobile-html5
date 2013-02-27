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
