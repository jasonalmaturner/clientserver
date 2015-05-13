import q from 'q';
import { getClients, getContacts } from './cs-service';

function save(obj){
  var dfd = q.defer();
  console.log(obj);

  getClients(obj)
    .then(function(results){
      return getContacts(results);
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json(err);
    });
  

  return dfd.promise;
};

export { save };
