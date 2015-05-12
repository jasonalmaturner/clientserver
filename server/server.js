/*
 * Modules
 */

import constObj from './assets/constants';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import * as surveyRequests from './assets/surveyRequests';
import dash from 'rethinkdbdash';

/*
 * Configuration
 */

var app = express(),
  port = 9001,
  r = dash({ db: 'nps_server' });

/*
 * Middleware
 */

app.use(bodyParser.json());
app.use(cors());

/*
 * Routes
 */
app.post('/api/save-survey/:userId', surveyRequests.saveSurvey)

/*
r.table('test').run().then(function(result){
  console.log(result);
});
*/

/*
 * Initialize
 */

app.listen(port, function() {
  console.log('listening at ' + port)
});


/*
 * Notes
 */

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
