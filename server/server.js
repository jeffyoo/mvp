var express    = require('express');
var bodyParser = require('body-parser');
var request    = require('request');
var morgan     = require('morgan')

var app = express();

var port = 1337;
var api_key = '39smr2ffkt72kbtvswmryyj6';

app.use(bodyParser.json());
app.use(express.static('../client'))
app.use(morgan('dev'))


app.get('/', function(req, res){
  res.sendFile('index.html');
})




// -- route --
// -- API call to get 5 year True-Cost-Ownership
app.get('/trueCost/:id', function(req, res) {

  // params = the :id AND req.params.id
  var apiUrl = 'https://api.edmunds.com/v1/api/tco/newtruecosttoownbystyleidandzip/'+ req.params.id +'/90703?fmt=json&api_key=' + api_key;
  // apiUrl in the first parameter of request

  request(apiUrl, function(error, response, body) {
    // console.log("returned from request")
    if (error) {
      console.log('error:', error);
    } else if (response.statusCode === 200) {
      console.log('this is the response', JSON.parse(body).value);
      res.json(JSON.parse(body).value);
    }
  })
})

app.get('/carMake', function(req, res) {
  var results = [];
  var apiUrl = 'https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=' + api_key + '&state=new';

  request(apiUrl, function(error, response, body) {
    if (error) {
      console.log('error:', error);
    } else if (response.statusCode === 200) {
        var arr = JSON.parse(body)['makes'];
        for (var i = 0; i < arr.length; i++) {
          for (var key in arr[i]) {
            if (key === 'name') {
              results.push(arr[i][key]);
            }
          }
        }
      res.send(results);
    }
  })
})

app.get('/carModel/:make', function(req, res) {
  var results = [];

  var apiUrl = 'https://api.edmunds.com/api/vehicle/v2/' + req.params.make +'/models?fmt=json&api_key=' + api_key;

  request(apiUrl, function(error, response, body) {
    if (error) {
      console.log('error:', error);
    } else if (response.statusCode === 200) {
        var arr = JSON.parse(body)['models'];
        for (var i = 0; i < arr.length; i++) {
          for (var key in arr[i]) {
            if (key === 'name') {
              results.push(arr[i][key]);
            }
          }
        }
      res.send(results);
    }
  })
})

app.get('/vehicleId/:make/:model', function(req, res) {
  var results = [];
  var apiUrl = 'https://api.edmunds.com/api/vehicle/v2/' + req.params.make + '/' + req.params.model + '/2016/styles?fmt=json&api_key=' + api_key;

  request(apiUrl, function(error, response, body) {
    if (error) {
      console.log('error:', error);
    } else if (response.statusCode === 200) {
      var arr = JSON.parse(body)['styles'];
      for (var i = 0; i < arr.length; i++) {
        for (var key in arr[i]) {
          if (key === 'id') {
            results.push(arr[i][key]);
          }
        }
      }
      res.send(results);
    }
  })


})





app.listen(port, function(){
  console.log('listening on port:', port);
})
