import { getResults } from './../services/data-service';

function total(req, res){
  req.query.current = req.query.current ? JSON.parse(req.query.current) : undefined;
  if(
    !req.query.tenant_id ||
    !req.query.offset
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getResults({ tenant_id: req.query.tenant_id, offset: req.query.offset })
      .then(results => res.json(results))
      .catch(err => res.status(500).json(err));
  };

};

function client(req, res){
  req.query.current = req.query.current ? JSON.parse(req.query.current) : undefined;
  if(
    !req.query.client_id ||
    !req.query.tenant_id ||
    !req.query.offset
  ) return res.status(400).send('Insufficient Parameters');
  else {
    getResults({ client_id: req.query.client_id, tenant_id: req.query.tenant_id, offset: req.query.offset })
      .then(results => res.json(results))
      .catch(err => res.status(500).json(err));
  };
};

export { total, client };
