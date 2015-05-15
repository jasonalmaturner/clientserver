import q from 'q';
import { getClients, getContacts } from './cs-service';
import { sendSurvey } from './email-service';
import { r } from './../configuration/database.js';

var surveys = r.table('surveys');

function send(obj){
  var dfd = q.defer();
  var survey = {
    tenant_id: obj.tenant_id,
    date: new Date(),
    clients: []
  }
  var response = {
    emails: [],
    survey: {}
  }

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
      return _saveSurvey(survey);
    })
    .then(function(results){
      // After saving survey to db
      response.survey = results;
      var promiseArray = survey.clients.map(function(item, index){
        return sendSurvey({ contacts: item.contacts, client_id: item.client_id }); 
      });
      return q.all(promiseArray);
    })
    .then(function(results){
      var success = [];
      var errors = [];
      results.forEach(function(item, index){
        item.success.forEach(function(item, index){
          success.push(item.contact_id);
        });
        item.errors.forEach(function(item, index){
          errors.push(item.contact_id);
        });
      });
      response.emails = {
        success: success,
        errors: errors
      };
      // Done
      dfd.resolve(response);
    })
    .catch(function(err){
      console.log(err);
      dfd.reject(err);
    });
  

  return dfd.promise;
};


function _saveSurvey(survey){
  var dfd = q.defer();
    if(
      !typeof survey === 'object' ||
      !survey.tenant_id ||
      !survey.date ||
      !survey.clients ||
      !survey.clients.length
    ) dfd.reject(new Error('Survey does not follow data model'));
    else {
      surveys.insert(survey).run().then(function(results){
        dfd.resolve(results);
      });
    }
  return dfd.promise;
};

function saveScore(obj){
  var dfd = q.defer();
  var survey = surveys.get(obj.survey_id);
  /*
  survey
    .update({ clients:  })
  */
  /*
  survey('clients')('contacts')
    .filter(contact => contact('contact_id').match(obj.contact_id))
    .run()
    .then(results => {
      console.log(results);
    })
  */

  
  // var latestSurvey =   surveys.filter({ tenant_id: obj.tenant_id }).max('date')

  //latestSurvey
  survey 
    .pluck({ clients: 'contacts' })
    .run()
    .then(results => {
      results.clients.forEach((item, outerIndex) => {
        item.contacts.forEach((item, index, array) => {
          if(Number(item.contact_id) === Number(obj.contact_id)) {
            array[index].score = obj.score;
            console.log(outerIndex, index);
          }
        });
      });
      survey
        .update(results)
        .run()
        .then(results =>{
          console.log(results);
        });
    })
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

export { send, saveScore };
