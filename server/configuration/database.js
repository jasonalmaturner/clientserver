import dash from 'rethinkdbdash';
var r = dash({ db: 'nps_server' });
export { r };

var indexes = { surveys: ['tenant_id'] };
var tables = ['surveys', 'custom_surveys'];

r.tableList().run() // Create tables for the first time
  .then(res => {
    tables.forEach(item => {
      if(res.indexOf(item) === -1) {
        r.tableCreate(item);
      }
    });
  });

for(var key in indexes){ // Create indexes for the first time
  r.table(key)
    .indexList()
    .run()
    .then(res =>{
      indexes[key].forEach(item => {
        if(res.indexOf(item) === -1) {
          r.table(key).indexCreate(item);
        }
      });
    });
};

/*
r.table('surveys')
  .indexCreate('tenant_id')
  .run()
  .then(results => console.log(results))
  .catch(err => console.log(err));
*/
