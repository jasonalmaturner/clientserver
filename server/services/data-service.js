import q from 'q';
import { r } from './../configuration/database';

var surveys = r.table('surveys');

function getClientData(obj){
  var dfd = q.defer();
  console.log(obj);
  surveys
    .filter(
      { client_id: obj.client_id }
    )
    .run()
    .then(results => dfd.resolve(results))
    .catch(err => dfd.reject(err));
  return dfd.promise;
};

export { getClientData };
