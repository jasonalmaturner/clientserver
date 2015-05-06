var constObj = require('./constants.js'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  session = require('express-session'),
  cors = require('cors'),
  mandrill = require('mandrill-api/mandrill'),
  mandrill_client = new mandrill.Mandrill(constObj.mandrill_key),
  port = 9001,
  r = require('rethinkdb'),
  rp = require('request-promise'),
  connection = null,
  surveyRequests = require('./assets/surveyRequests');

app.use(bodyParser.json());
app.use(cors());

// save survey template info (save company name, from name, reply email, top bar color, button color, img url, and timestamp)
app.post('api/save-survey/:userId', surveyRequests.saveSurvey)

app.listen(port, function() {
  console.log('listening at ' + port)
});
r.connect({host: 'localhost', port: 28015}, function(err, conn){
  if(err) console.log(err);
  connection = conn;
})


// create a survey table



// APIs imma need:
// receiving html string, (or just store the html string in the server/database, and just
// populate it)
// getting info from database w/reg ex to populate html string w/
// client info (image,company name) to send email to client contacts
// Be sure to add timestamp when emailed. Add to an array of times emailed?
// Have an api that takes in a query/param for the score, client, and contact,
// and redirects to the landing page to add comments
// api to update submission after submitting feedback

// get client and contact info


// save survey being sent out (the html string? or just the colors and image?)
// save survey responses

// individual client score
// total client score
// compare to previous month

//
