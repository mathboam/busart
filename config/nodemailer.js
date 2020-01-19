var nodemailer = require('nodemailer')
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: 'SENDGRID_USERNAME',
    api_key: 'SENDGRID_PASSWORD'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

var email = {
  from: 'awesome@bar.com',
  to: 'mr.walrus@foo.com',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
};

client.sendMail(email, function(err, info){
    if (err ){
      console.log(error);
    }
    else {
      console.log('Message sent: ' + info.response);
    }
});