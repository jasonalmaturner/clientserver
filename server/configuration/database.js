import dash from 'rethinkdbdash';
var r = dash({ db: 'nps_server' });
export { r };
