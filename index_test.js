console.log('Loading event');
//
var config = require('./config');
var request = require('request');
var url = 'https://app.datadoghq.com/api/v1/events?api_key=' + config.api_key;

exports.handler = function(event, context) {
  // Generate formData
  // var message = JSON.parse(event.Records[0].Sns.Message);
  var message = event;
  var formData = {
    "title": message.title,
    "text": message.message,
    "alert_type": "error"
  };

  // Post to im.kayac.com
  console.log('Sending Datadog event: ');
  console.log('URL: ' + url);
  console.log('Message: ' + JSON.stringify(formData));
  request.post({ url: url, body: JSON.stringify(formData), headers: { 'Content-type': 'application/json' }}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('Message send failed:', err);
    }
    console.log('Message send successful!  Server responded with:', body);
    context.done(null,'');
  });
};
