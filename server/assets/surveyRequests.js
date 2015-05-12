import dash from 'rethinkdbdash';
var r = dash({ db: 'nps_server' });
var surveyRequests = {};

surveyRequests.saveSurvey = function(req, res){
  var survey = req.body;
  survey.user = req.params.userId;
  r.table('surveys').insert(survey).run().then(function(result, maybe){
    console.log(result, maybe);
  });
}

module.exports = surveyRequests
