import q from 'q';
import { getClients, getContacts } from './cs-service';
import { sendSurvey } from './email-service';

function send(obj){
  var dfd = q.defer();
  var survey = {
    tenant_id: obj.tenant_id,
    date: new Date(),
    clients: []
  };

  getClients(obj)
    .then(function(results){
      // After getting clients
      
      survey.clients = results.map(function(item, index){
        return { client_id: item.id, name: item.name, contacts: [] };
      });

      var promiseArray = results.map(function(item, index){
        // gathering promises for 'getContacts' method
        return getContacts({ id: item.id, access_token: obj.access_token });
      });
      return q.all(promiseArray);
    })
    .then(function(results){
      // After getting contacts
    
      results.forEach(function(item, index){
        // Merge contacts into clients
        item = item.map(function(item, index){
          return { contact_id: item.id, score: null, feedback: null, email: item.email, last_modified: new Date() };
        });
        survey.clients[index].contacts = item;
      });
      /*
       * I'm sending the emails here, but I want to 
       * Create the survey before sending the emails.
       */
      var promiseArray = survey.clients.map(function(item, index){
        return sendSurvey({ contacts: item.contacts, client_id: item.client_id }); 
      });
      return q.all(promiseArray);
    })
    .then(function(results){
      dfd.resolve(results);
    })
    .catch(function(err){
      console.log(err);
      dfd.reject(err);
    });
  

  return dfd.promise;
};


/*
 
  Survey:
    tenant_id:
    date:
    clients: [{
      id:
      name:
      contacts: [{
        id:
        score:
        feedback:
      }]
    }]
*/ 

export { send };
