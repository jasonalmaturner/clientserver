import dash from 'rethinkdbdash';
import q from 'q';

var r = dash({ db: 'nps_server' });
export { r };

var indexes = { surveys: ['tenant_id'] };
var tables = ['surveys', 'custom_surveys'];

var tablesArray = []
tablesArray.push(r.tableList().run())

 // Create tables for the first time

q.all(tablesArray).then(res => {
  var promiseArray = [];
  tables.forEach(item => {
    if(res.indexOf(item) === -1) {
      promiseArray.push(r.tableCreate(item).run());
    }
  });
  return q.all(promiseArray);
}).then(function(){
  var promiseArray = [];
  for(var key in indexes){ // Create indexes for the first time
    r.table(key)
      .indexList()
      .run()
      .then(res =>{
        indexes[key].forEach(item => {
          if(res.indexOf(item) === -1) {
            promiseArray.push(r.table(key).indexCreate(item).run());
          }
      });
    });
  };
  return q.all(promiseArray);
});


