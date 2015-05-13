import q from 'q';
import axios from 'axios';
import { CS_BASE_URL } from './../configuration/constants';

function save(obj){
  var dfd = q.defer();
  console.log(obj);

  var reqUrl = `${CS_BASE_URL}/api/client/summarylist?access_token=${obj.access_token}`;
  console.log(reqUrl);
  axios({
    method: 'GET',
    url: reqUrl
  })
  .then(function(response){
    console.log(response);
  })
  .catch(function(response){
    console.log(response);
  });


  return dfd.promise;
};

export { save };
