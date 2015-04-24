//Problem: We need simple way to look at user's badge count and Javascript points from a web browser
//Solution: Use Node.js to perform the profile look ups and server our template via HTTP

var router = require("./router.js"); 
//1. Create a web Server
var http = require('http');

http.createServer(function (request, response) {
  router.home(request, response);
  router.test(request, response);  
}).listen(8080);
console.log('Server running at http://<workspace-url>:8080/');


