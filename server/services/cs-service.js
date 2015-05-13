import axios from 'axios';
import q from 'q';
import { CS_BASE_URL } from './../configuration/constants';

function getClients(obj){
  var dfd = q.defer();
  var reqUrl = `${CS_BASE_URL}/api/client/summarylist?access_token=${obj.access_token}`;
  console.log(reqUrl);
  axios({
    method: 'GET',
    url: reqUrl
  })
  .then(function(response){
    response = response.data;
    response = response.filter(function(item){
      return obj.clients.indexOf(item.id) >= 0;
    });
    dfd.resolve(response);
  })
  .catch(function(response){
    console.log(response);
    dfd.reject(response);
  });
  return dfd.promise;
}

export { getClients };
