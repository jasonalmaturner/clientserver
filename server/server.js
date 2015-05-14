/*
 * Modules
 */

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

/*
 * Configuration
 */

import { r } from './configuration/database.js';
import constObj from './configuration/constants';

var app = express(),
  credentials = {
    key: fs.readFileSync('server/server_cert/key.pem', 'utf8'),
    cert: fs.readFileSync('server/server_cert/cert.pem', 'utf8')
  },
  server = https.createServer(credentials, app),
  port = 9001;


/*
 * Controllers
 */

import * as custom from './controllers/custom';
import * as survey from './controllers/survey';
import * as respond from './controllers/respond';


/*
 * Middleware
 */

app.use(bodyParser.json());
app.use(cors());


/*
 * Routes
 */

// Custom Surveys
app.post('/api/save-survey/:userId', custom.save);
app.get('/api/save-survey/:userId', custom.get);

// Receive Responses
//app.post('/api/respond/score', respond.score);
//app.post('/api/respond/feedback', respond.feedback);

// Send Survey
app.post('/api/survey', survey.send);
// r.tableCreate('survey').run();


app.get('/api/test', function(req, res){
  res.send('Now working');
});

/*
 * Initialize
 */

server.listen(port, function() {
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
