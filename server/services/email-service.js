import q from 'q';

function sendSurvey(obj){
  var contacts = obj.contacts;
  var dfd = q.defer();
  var results = {
    client_id: obj.client_id,
    errors: [],
    success: []
  }
      /*
       * {
       *  client_id: obj.client_id,
       *  errors: [
       *    // 'contact_id's of those who failed
       *  ],
       *  success: [
       *    // 'contact_id's of those who succeeded
       *  ]
       * }
       */
  if(!contacts.length) dfd.resolve(results);
  else {
    console.log(`Sending emails to ${contacts.length} contacts`); 
    setTimeout(function(){ 
      results.success = contacts;
      dfd.resolve(results)
    }, 500);
  }
  return dfd.promise;
};

export { sendSurvey };

