import { r } from './../configuration/database.js';
import { save, get } from './../services/custom-service.js';

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


module.exports = surveyRequests
