import q from 'q';
import { getClients, getContacts } from './cs-service';

function save(obj){
  var dfd = q.defer();
  var clients = [];
  var contacts = [];


  getClients(obj)
    .then(function(results){
      var promiseArray = results.map(function(item, index){
        return getContacts({ id: item.id, access_token: obj.access_token });
      });
      return q.all(promiseArray);
    })
    .then(function(results){
      results = results.reduce(function(prev, next){
        return prev.concat(next.reduce(function(prev, next){
          return prev.concat(next);
        }, []));
      }, []);
      
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json(err);
    });
  

  return dfd.promise;
};

export { save };
