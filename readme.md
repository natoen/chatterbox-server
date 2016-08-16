# Chatterbox Server
A server side implementation of our [Chatterbox Client][chatterboxclient] using [Node.js][node].

## Instructions:
- Please make sure to do a `npm install` first
- to start our app just do type `node server/basic-server.js` in the command line
- To run the tests just do an `npm test` in the command line
- To see the test files go to `server/spec/`

## Usage:
to post a message try:
>curl -v -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/classes/messages -d '{"username": "Warlord", "message": "MAAARRCH!!"}'

where you should be receiving a `1` as the post id

to get data try:
>curl -v -X GET http://127.0.0.1:3000/classes/messages

where you should be receiving a `{"results":[{"username":"Warlord","message":"MAAARRCH!!","roomname":"lobby","createdAt":"2016-08-16T13:30:54.504Z","objectId":1}]}` as the previous post

* do a `man curl` if aren't familiar with the options


[chatterboxclient]: https://github.com/natoen/chatterbox-client
[node]: https://nodejs.org