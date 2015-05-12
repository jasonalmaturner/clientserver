import dash from 'rethinkdbdash';
var r = dash();

function saveSurvey(req, res){
  var survey = req.body;
  survey.user = req.params.userId;
  r.table('surveys').insert()
}

export { saveSurvey };
