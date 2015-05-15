import { getClientData } from './../services/data-service';

function total(req, res){

};

function client(req, res){
  if(
    !req.query.client_id
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getClientData(req.query)
      .then(results => console.log(results))
      .catch(err => console.log(err));
  };
};

export { total, client };
