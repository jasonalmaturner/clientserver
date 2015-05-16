import { r } from './../configuration/database';
import * as survey from './../services/survey-service';
import * as email from './../services/email-service';

function send(req, res){

  if(
      !req.query.access_token || 
      !req.query.tenant_id || 
      !Array.isArray(req.body) || 
      req.body.length < 1
  ) { return res.status(400).send('Insufficient parameters for request') }

  var obj = {
   access_token: req.query.access_token,
   tenant_id: req.query.tenant_id,
   clients: req.body
  };
  
  survey.send(obj)
    .then(function(results){
      res.json(results);
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json(err);
    });
}

export { send };
