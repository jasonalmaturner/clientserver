var r = require('rethinkdb');
var surveyRequests = {};

surveyRequests.saveSurvey = function(req, res){
  var survey = req.body;
  survey.user = req.params.userId;
  r.table('surveys').insert()
}

module.exports = surveyRequests
