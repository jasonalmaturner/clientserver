var constObj = require('./constants.js'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  session = require('express-session'),
  cors = require('cors'),
  mandrill = require('mandrill-api/mandrill'),
  mandrill_client = new mandrill.Mandrill(constObj.mandrill_key),
  port = 9001;

app.use(bodyParser.json());
app.use(cors());


app.listen(port, function() {
  console.log('listening at ' + port)
})
