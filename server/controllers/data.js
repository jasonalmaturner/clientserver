import { getClientData } from './../services/data-service';

function total(req, res){

};

function client(req, res){
  if(
    !req.query.client_id ||
    !req.query.tenant_id
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getClientData(req.query)
      .then(results => res.json(results))
      .catch(err => res.status(500).json(err));
  };
};

export { total, client };
