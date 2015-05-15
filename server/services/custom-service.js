import { r } from './../configuration/database';
import q from 'q';
import _ from 'lodash';

var defaultSettings = {
  topBar: {
    background: "#83CE00"
  },
  button: {
    background: '#83CE00',
    color: "white"
  }
};

var customSurveys = r.table('custom_surveys');

function save(survey){
  var dfd = q.defer();
  customSurveys
    .insert(survey, { returnChanges: true, conflict: "update" })
   .run()
   .then(function(results){
     return dfd.resolve(results.changes[0].new_val);
   })
  return dfd.promise;
}

function get(id){
  var dfd = q.defer();
  customSurveys
  .filter({ user: id })
  .run()
  .then(function(results){
    // If they exist, resolve
    if(results.length){
      return dfd.resolve(results[0]);
    }
    // else, create new one with default settings

    else {
      results = _.cloneDeep(defaultSettings)
      results.user = id;
      return save(results);
    }
  })
  .then(function(results){
    // then return the results of creating it
    return dfd.resolve(results);
  });
  return dfd.promise;
}


export { save, get };
