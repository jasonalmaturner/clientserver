import axios from 'axios';
import q from 'q';
import { CS_BASE_URL } from './../configuration/constants';

function getClients(obj){
  var dfd = q.defer();
  var reqUrl = `${CS_BASE_URL}/api/client/summarylist?access_token=${obj.access_token}`;
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

function getContacts(obj){
  var dfd = q.defer();
  var reqUrl = `${CS_BASE_URL}/api/client/${obj.id}/contact?access_token=${obj.access_token}`;
  axios({
    method: 'GET',
    url: reqUrl
  })
  .then(function(response){
    dfd.resolve(response.data);
  })
  .catch(function(response){
    console.log(response);
    dfd.reject(response);
  });
  return dfd.promise;
    
  // var contactsList = apiAuth.one('api/client', clientId).all('contact').getList();
};

export { getClients, getContacts };
