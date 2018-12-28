const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

// configs
var configs = require('./configs.js');
var listid = configs.listid;
var apikey = configs.apikey;

// bodyparser middleware
app.use(bodyParser.urlencoded({extended:true}));

// signup route
app.post('/signup', (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  // make sure fields are not empty
  if(!email) {
    console.log("missing field");
    res.send(false);
    return;
  }

  // construct request data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed'
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/' + listid,
    method: 'POST',
    headers: {
      Authorization: 'auth ' + apikey
    },
    body: postData
  }

  request(options, (err, response, body) => {
    if(err) {
      console.log(err);
      res.send(false);
    }
    else {
      if(response.statusCode === 200) {
        console.log(email + " is registered!");
        res.send(true);
      }
      else {
        console.log(response.statusCode);
        res.send(false);
      }
    }

  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
