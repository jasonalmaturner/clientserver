import dash from 'rethinkdbdash';
var r = dash({ db: 'nps_server' });
export { r };

var indexes = { surveys: ['tenant_id'] };

/*
r.table('surveys')
  .indexCreate('tenant_id')
  .run()
  .then(results => console.log(results))
  .catch(err => console.log(err));
*/
