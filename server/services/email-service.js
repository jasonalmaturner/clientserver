import q from 'q';
import { r } from './../configuration/database.js';
var path           = require('path')
    , templatesDir   = path.resolve(__dirname, '../templates')
    , emailTemplates = require('email-templates')
    , postmark       = require('postmark')('c2a08cba-1281-444c-9e6c-da2c064b3e4f');

function sendSurvey(obj){
  var contacts = obj.contacts;
  var dfd = q.defer();
  var results = {
    client_id: obj.client_id,
    errors: [],
    success: []
  };
      /*
       * {
       *  client_id: obj.client_id,
       *  errors: [
       *    // 'contact_id's of those who failed
       *  ],
       *  success: [
       *    // 'contact_id's of those who succeeded
       *  ]
       * }
       */
  if(!contacts.length) dfd.resolve(results);
  else {
    r.table('custom_surveys').filter({user: obj.tenant_id})
    .then(function(data){
          data = data[0];
          //Start Email Template
          emailTemplates(templatesDir, function(err, template) {

            if (err) {
              console.log(err);
            } else {

              // ## Send a single email

              // An example users object with formatted email function
              var promiseArr = [];
              contacts.forEach(function(contact){
                var deferred = q.defer();
                promiseArr.push(deferred.promise);
                if(contact.email){
                  var locals = {
                    company: data.company,
                    contact_id: contact.contact_id,
                    survey_id: obj.survey_id,
                    image: 'http://startupweekend.org/wp-content/blogs.dir/1/files/2013/04/CokeLogo1.png',
                    button: data.button.background,
                    topBar: data.topBar.background
                  };

                  // Send a single email
                  template('survey', locals, function(err, html, text) {
                    if (err) {
                      console.log(err);
                    } else {
                      postmark.send({
                        From: "Daniel Kesler <jacob.turner@devmounta.in>",
                        To: "j.israel.turner@gmail.com",
                        Subject: `How likely are you to recommend ${data.company} to a friend?`,
                        HtmlBody: html
                      }, function(err, response){
                        if(err){
                          results.errors.push(contact);
                          deferred.resolve();
                        } else {
                          results.success.push(contact);
                          deferred.resolve();
                        }
                      });
                    }
                  });
                }
                else {
                  results.errors.push(contact);
                }
              });
              q.all(promiseArr).then(function(){
                dfd.resolve(results);
              })
            }
          });
        });

  }
  return dfd.promise;
}






export { sendSurvey };

