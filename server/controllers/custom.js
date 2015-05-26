import { r } from './../configuration/database.js';
import { save, get } from './../services/custom-service.js';
import { getSurvey } from './../services/survey-service.js';

var surveyRequests = {};

surveyRequests.save = function(req, res){
  var survey = req.body;
  survey.user = req.params.userId;
  save(survey).then(function(results){
    res.json(results);
  });
}

surveyRequests.get = function(req, res){
  var id = req.params.userId
  get(id).then(function(results){
    res.json(results);
  });
};

surveyRequests.getNoUser = function(req, res){
  if(
    !req.query.survey_id
  ) return res.status(400).send();
  getSurvey(req.query)
    .then(results => {
      if(!results) res.status(400).send('Invalid survey_id');
      req.params.userId = results.tenant_id;
      surveyRequests.get(req, res);
    });
};


module.exports = surveyRequests
