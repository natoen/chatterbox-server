// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};
// Tell the client we are sending them plain text.
// defaultCorsHeaders['Content-Type'] = 'text/plain';

exports.sendResponse = function(response, statusCode, data) {
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers. statusCode = outgoing status
  response.writeHead(statusCode, defaultCorsHeaders);
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  // Calling .end 'flushes' the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(data === null ? null : data));
};
