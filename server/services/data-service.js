import q from 'q';
import { r } from './../configuration/database';

var surveys = r.table('surveys');

function getResults(obj){
  var dfd = q.defer();
  var year = r.now().date().year(); 
  var quarter = _getQuarter(obj.current);
  surveys
    .getAll(obj.tenant_id, { index: 'tenant_id' })
    .filter( r.row('date').year().eq(year))
    .run()
    .then(res => _parseContacts({ surveys: res, client_id: obj.client_id }))
    .then(res => _calcNps(res))
    .then(res => dfd.resolve(res))
    .catch(err => dfd.reject(err));
  return dfd.promise;
};

function _parseContacts(obj){
  var dfd = q.defer();
  var results = [];

  obj.surveys.forEach((item, index) => {
    item.clients.forEach((item, index) => {
      if(obj.client_id && item.client_id == obj.client_id){
        results = results.concat(item.contacts);
      } else if (!obj.client_id){
        results = results.concat(item.contacts);
      }
    })
  });

  dfd.resolve(results);

  return dfd.promise;
};

function _getQuarter(current){
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var results = {
    current: {
      from: null,
      to: null
    },
    previous: {
      from: null,
      to: null
    }
  }
 

  switch (month){
    case 1 :
    case 2 :
    case 3 :
      results.current.from = makeDate(false, 1,1,year);
      results.current.to = makeDate(true, 3,31,year);
      results.previous.from = makeDate(false, 10,1,year-1);
      results.previous.to = makeDate(true, 12,31,year-1);
      break;
    case 4 :
    case 5 :
    case 6 :
      results.current.from = makeDate(false, 4,1,year);
      results.current.to = makeDate(true, 6,30,year);
      results.previous.from = makeDate(false, 1,1,year);
      results.previous.to = makeDate(true, 3,31,year);
      break;
    case 7 :
    case 8 :
    case 9 :
      results.current.from = makeDate(false, 7,1,year);
      results.current.to = makeDate(true, 9,30,year);
      results.previous.from = makeDate(false, 4,1,year);
      results.previous.to = makeDate(true, 6,30,year);
      break;
    case 10 :
    case 11 :
    case 12 :
      results.current.from = makeDate(false, 10,1,year);
      results.current.to = makeDate(true, 12,31,year);
      results.previous.from = makeDate(false, 7,1,year);
      results.previous.to = makeDate(true, 9,30,year);
      break;
  }

  function makeDate(last, month, day, year){
    month = month - 1;
    if(!last) return new Date(year, month, day);
    else return new Date(year, month, day, 23, 59, 59);
    // Needs to be 23:59:59 if the last day of the year;
  }
  

  console.log(results);
}

function _calcNps(responses){
  var dfd = q.defer();
  var results = {
    promoters: [],
    detractors: [],
    neutrals: []
  };

  responses.forEach((item, index) => {
    if(!item.score) return;
    else if(item.score >= 9) results.promoters.push(item);
    else if(item.score <= 8 && item.score >= 7) results.neutrals.push(item);
    else if(item.score <= 6) results.detractors.push(item);
  });

  dfd.resolve(results);
  return dfd.promise;
}

export { getResults };
