import { getResults } from './../services/data-service';

function total(req, res){
  if(
    !req.query.tenant_id
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getResults({ tenant_id: req.query.tenant_id })
      .then(results => res.json(results))
      .catch(err => res.status(500).json(err));
  };

};

function client(req, res){
  if(
    !req.query.client_id ||
    !req.query.tenant_id
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getResults({ client_id: req.query.client_id, tenant_id: req.query.tenant_id })
      .then(results => res.json(results))
      .catch(err => res.status(500).json(err));
  };
};

export { total, client };
