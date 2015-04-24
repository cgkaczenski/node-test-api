var Stock = require("./stock.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");
var commonHeaders = {'Content-Type': 'text/html'}


//Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
  //if url == "/" && GET
  if (request.url === '/'){
    if(request.method.toLowerCase() === "get") {
      //show search 
      response.writeHead(200, commonHeaders);
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else{
      //if url == "/" && POST 
      
      //get the post data from body
      request.on("data", function(postBody){
        //extract the username
        var query = querystring.parse(postBody.toString());

        //redirect to /:username
        response.writeHead(303, {"Location": "/" + query.symbol});
	response.end();
      });

    }
  }
  

}

//test route
function test(request, response) {
  //if url == "/...."                                                                                    
  var symbol = request.url.replace("/", "");
  if (symbol.length > 0 && symbol != "favicon.ico") {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);
    
    var stockData = new Stock(symbol);
      
    stockData.on("end", function(stockJSON) {
    values = {
	symbol : stockJSON.query.results.quote[0].Symbol,
	price : stockJSON.query.results.quote[0].Close
    }	

    renderer.view("stock", values, response);	
    //console.log(stockJSON.query.results.quote[0].Symbol);
    renderer.view("footer", {}, response);  
    response.end();
    });
  }

}                                                        
                                                              
// Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
  //if url == "/...."
  var username = request.url.replace("/", "");
  if (username.length > 0) {
    response.writeHead(200, commonHeaders);
    renderer.view("header", {}, response);
    
    //get json from Treehouse
    var studentProfile = new Profile(username);
    //on end
    studentProfile.on("end", function(profileJSON) {
      //show profile
      
      
      //Store the values which we need 
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      
      //simple response
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    
    //on error
    studentProfile.on("error", function(error) {
      //show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    });    
  }
}

module.exports.home = home;
module.exports.test = test;
module.exports.user = user;











