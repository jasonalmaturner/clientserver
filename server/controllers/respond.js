import { saveScore, saveFeedback } from './../services/survey-service';

function score(req, res){
  if(
    !req.query.contact_id ||
    !req.query.survey_id ||
    !req.query.score
  ) return res.status(400).send('insufficient parameters');
  else {
   saveScore(req.query)
    .then(response => res.json(response)) // We need to change this to a redirect to the landing/feedback page.
    .catch(err => res.status(500).json(err));
  }
};

function feedback(req, res){
  if(
    !req.query.contact_id ||
    !req.query.survey_id ||
    !req.body.feedback
  ) return res.status(400).send('insufficient parameters');
  else {
    req.query.feedback = req.body.feedback;
    saveFeedback(req.query)
    .then(response => res.json(response))
    .catch(err => res.status(500).json(err));
  }
};



export { score, feedback };
