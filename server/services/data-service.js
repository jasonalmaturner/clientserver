import q from 'q';
import { r } from './../configuration/database';

var surveys = r.table('surveys');

function getResults(obj){
  var dfd = q.defer();
  var year = r.now().date().year(); 
  surveys
    .getAll(obj.tenant_id, { index: 'tenant_id' })
    .filter( r.row('date').year().eq(year))
    .run()
    .then(res => _parseContacts({ surveys: res, client_id: obj.client_id }))
    .then(res => _calcNps(res))
    .then(res => dfd.resolve(res))
    .catch(err => dfd.reject(err));
  return dfd.promise;
};

function _parseContacts(obj){
  var dfd = q.defer();
  var results = [];

  obj.surveys.forEach((item, index) => {
    item.clients.forEach((item, index) => {
      if(obj.client_id && item.client_id == obj.client_id){
        results = results.concat(item.contacts);
      } else if (!obj.client_id){
        results = results.concat(item.contacts);
      }
    })
  });

  dfd.resolve(results);

  return dfd.promise;
};

function _calcNps(responses){
  var dfd = q.defer();
  var results = {
    promoters: [],
    detractors: [],
    neutrals: []
  };

  responses.forEach((item, index) => {
    if(!item.score) return;
    else if(item.score >= 9) results.promoters.push(item);
    else if(item.score <= 8 && item.score >= 7) results.neutrals.push(item);
    else if(item.score <= 6) results.detractors.push(item);
  });

  dfd.resolve(results);
  return dfd.promise;
}

export { getResults };
