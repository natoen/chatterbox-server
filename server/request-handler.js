/* Import sendResponse from utilities.js */
var sendResponse = require('./utilities.js').sendResponse; 

// database
var resultsObj = {
  results: []
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray

  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // Our router (404 with data as null if wrong request) 
  if (request.url.indexOf('/classes') < 0) {
    sendResponse(response, 404, null);
  } else {
    if (request.method === 'POST') {
      request.on('error', function(err) {
        console.error(err);
      });

      var data = '';
      request.on('data', function(hexData) {
        data += hexData.toString();
      });

      request.on('end', function() {
        data = JSON.parse(data);
        data.roomname = data.roomname || 'lobby';
        data.createdAt = new Date();
        data.objectId = resultsObj.results.length + 1;
        resultsObj.results.push(data);
      });
      
      sendResponse(response, 201, resultsObj.results.length + 1);
    } else if (request.method === 'GET') {
      sendResponse(response, 200, resultsObj);
    }
  }  
};


exports.requestHandler = requestHandler;
