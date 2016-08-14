// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var resultsObj = {
  results: []
};

var id = 1;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray

  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  var statusCode = 200;

  if (request.method === 'POST') {
    statusCode = 201;

    request.on('error', function(err) {
      console.error(err);
    });

    var data;
    request.on('data', function(stringData) {
      data = JSON.parse(stringData);
    });

    request.on('end', function() {
      var message = {
        username: data.username,
        roomname: data.roomname || 'lobby',
        message: data.message,
        createdAt: new Date(),
        updatedAt: new Date(),
        objectId: ++id
      };
      
      resultsObj.results.push(message);
    });
  }

  if (request.url.indexOf('/classes') === -1) {
    statusCode = 404;
  }

  // Tell the client we are sending them plain text.
  // defaultCorsHeaders['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, defaultCorsHeaders);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end 'flushes' the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(resultsObj));
};



exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;