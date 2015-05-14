import { saveScore } from './../services/survey-service';

function score(req, res){
  if(
    !req.query.contact_id ||
    !req.query.tenant_id ||
    !req.query.score
  ) return res.status(400).send('insufficient parameters');
  else {
   saveScore(req.query)
    .then(function(response){
      console.log(response);
    });
  }
};

function feedback(req, res){
  if(
    !req.query.contact_id ||
    !req.query.tenant_id ||
    !req.query.feedback
  ) return res.status(400).send('insufficient parameters');
  else {
   saveFeedback(req.query)
    .then(function(response){
      console.log(response);
    });
  }
};



export { score, feedback };
