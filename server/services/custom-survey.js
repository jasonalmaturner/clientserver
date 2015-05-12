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



/*
function create(survey){
  return r.table('surveys').insert(survey).run();
};

function save(survey){
  var dfd = q.defer();
  return r.table('surveys')
  .filter({ user: survey.user })
  .update(survey)
  .run()
  .then(function(results){
    console.log(results);
    if(results.replaced || results.unchanged) return dfd.resolve(results);
    else return create(survey);
  })
  .then(function(results){
    console.log(results);
    dfd.resolve(results);
  });
  return dfd.promise;
}
*/

function save(survey){
  console.log(survey);
  var dfd = q.defer();
  r.table('surveys')
   .insert(survey, { returnChanges: true, conflict: "update" })
   .run()
   .then(function(results){
     return dfd.resolve(results.changes[0].new_val);
   })
  return dfd.promise;
}

function get(id){
  var dfd = q.defer();
  r.table('surveys')
  .filter({ user: id })
  .run()
  .then(function(results){
    console.log(results.length);
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
    console.log(results);
    return dfd.resolve(results);
  });
  return dfd.promise;
}


export { save, get };
