var constObj = require('./constants.js'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  mongoose = require('mongoose'),
  db = mongoose.connection,
  session = require('express-session'),
  cors = require('cors'),
  mandrill = require('mandrill-api/mandrill'),
  mandrill_client = new mandrill.Mandrill(constObj.mandrill_key),
  port = 9001,
  dbUrl = 'mongodb://localhost/test';

app.use(bodyParser.json());
app.use(cors());


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  app.listen(port, function() {
    console.log('listening at ' + port)
  });
});

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
