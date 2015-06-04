import q from 'q';
import { r } from './../configuration/database';

var surveys = r.table('surveys');

function getResults(obj){
  var dfd = q.defer();
  var year = r.now().date().year(); 
  var quarter = _getQuarters(obj.offset);
  console.log(quarter);
  surveys
    .getAll(obj.tenant_id, { index: 'tenant_id' })
    .filter( r.row('date').year().eq(year))
    .filter( r.row('date').during(r.time(
      quarter.current.from.getFullYear(),
      quarter.current.from.getMonth() + 1,
      quarter.current.from.getDate(),
      '-06:00'
    ), r.time(
      quarter.current.to.getFullYear(),
      quarter.current.to.getMonth() + 1,
      quarter.current.to.getDate(),
      '-06:00'
    )))
    .run()
    .then(res => _parseContacts({ surveys: res, client_id: obj.client_id }))
    .then(res => _calcNps(res))
    .then(res => dfd.resolve(res))
    .catch(err => dfd.reject(err));
  return dfd.promise;
};

function _parseContacts(obj){
  console.log(obj);
  var dfd = q.defer();
  var results = [];
  var total = 0;
  obj.surveys.forEach((item, index) => {
    item.clients.forEach((item, index) => {
      total += item.contacts.length;
      if(obj.client_id && item.client_id == obj.client_id){
        results = results.concat(item.contacts);
      } else if (!obj.client_id){
        results = results.concat(item.contacts);
      }
    })
  });
  results.total = total;
  dfd.resolve(results);
  return dfd.promise;
};

function _getQuarters(offset){
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  if(offset) {
    if(month > 3 * offset) month -= 3 * offset; // if the offset will still remain in this year
    else {
      month += (12 - offset * 3); 
      year--;
    }// if the month must be set back to last year
  }
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

  return results;

  function makeDate(last, month, day, year){
    month = month - 1;
    if(!last) return new Date(year, month, day);
    else return new Date(year, month, day, 23, 59, 59);
  }
}

function _calcNps(responses){
  var dfd = q.defer();
  var results = {
    promoters: [],
    detractors: [],
    neutrals: [],
    totalSent: responses.total
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
