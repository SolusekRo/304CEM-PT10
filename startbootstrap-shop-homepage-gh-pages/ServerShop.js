
var http = require('http');
var fs = require("fs");
var qs = require('querystring');

var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://localhost:27017/";

http.createServer(function(request, response) {

	if(request.url === "/kk"){
		sendFileContent(response, "login.html", "text/html");
	} else if(request.url === "/Shop"){
		sendFileContent(response, "index.html", "text/html");
		} else if(request.url === "/Fav"){
			sendFileContent(response, "Favlist.html", "text/html");
			} else if(request.url === "/"){
		console.log("Requested URL is url" +request.url);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
// Mongo DB 
// collection customers ( "email", "password", "id")
// collection FavList ( "email", "FavID", "Favourite", "id")
// create 2 unique indexes 
// db.customers.createIndex( {"id":1,{unique: true} )
// db.FavList.createIndex( {"id":1, "FavID":1},{unique: true} )

// REGISTER
	
    else if(request.url==="/test"){
              
        if (request.method === "POST") {
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log(formData);
		  
		  info=formData.split("&");

		  dott=info[0].split("=");
		  dott2=info[1].split("=");

          return request.on('end', function() {
            var user;
			var date = new Date();
			var xreturn = "YES";
            user = qs.parse(formData);
			
			// define user.id by using yyyymmddhhmmss and milliseconds
			
			user.id = date.getUTCFullYear() + ("0" + (date.getUTCMonth()+1)).slice(-2) + ("0" + date.getUTCDate()).slice(-2) 
			          + ("0" + date.getUTCHours()).slice(-2)  +  ("0" + date.getUTCMinutes()).slice(-2) + ("0" + date.getUTCSeconds()).slice(-2) 
					  + ("0" + "0" + date.getUTCMilliseconds()).slice(-3);
			
			console.log(user.id);

            msg = JSON.stringify(user);
         			
		  stringMsg = JSON.parse(msg);
		  
		   MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("n123db"); 

  					var myobj = stringMsg;										

						// insert new customer record
						dbo.collection("customers").insertOne(myobj, function(err, result) {
						
						
						if (err) {
							console.log(err.code);
							// check whether the email address is registered
							if (err.code == 11000) {
								xreturn = "NO";
								console.log("duplicate email address");
							} else {
								throw err;
							}
						} else {
							console.log("1 document inserted");
						}
				
						db.close();

						return response.end(xreturn);
						});

					});
			
            
          });		  		  		  		  
        });	       
      }
	}
	
	
	// AddFAV
	
    else if(request.url==="/addFav"){
              
        if (request.method === "POST") {
        formData = '';
        msg = '';
		
		
        return request.on('data', function(data) {
          formData += data;
          console.log("step1"+formData);
		  
		  	  
		  favinfo=formData.split("&");

		  favdot=favinfo[2].split("=");
		  favdot2=favinfo[4].split("=");
		  
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);

            msg = JSON.stringify(user);
         			
		  stringMsg = JSON.parse(msg);
		  
		   MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("n123db");
					
													
					var myfav = stringMsg;										
					    //add a favlist record into the DB
						dbo.collection("FavList").insertOne(myfav, function(err, result) {
						if (err) {
							console.log(err.code);
								//check whether the fav list item is existed
								if (err.code == 11000) {
									console.log("Favourite list already added");
								} else {
									throw err;
								}
						} else {
								console.log("1 document inserted");
						}
	
						db.close();

						});
						

					});
			
            
          });		  		  		  		  
        });	       
      }
	}
	
// LoadFav

    else if(request.url==="/loadFav"){
              
        if (request.method === "POST") {
            
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          
		  formData += data;
		  
		  favinfo=formData.split("&");
		  favdot=favinfo[1].split("=");
		  
   		  console.log("step c " + formData);	 
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);
 
            msg = JSON.stringify(user);
			
		  stringMsg = JSON.parse(msg);
		  
		   MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("n123db");
	 				var myobj = stringMsg;
					var query = {id: favdot[1]};
					console.log(query);
					//get all fav list items of the user from DB		
					dbo.collection("FavList").find(query).toArray(function(err, result) {

						
						if (err) throw err;						
		
						db.close();
						
						
						if(result != null) {
							var arrayfav=[];
							for (var i=0; i<result.length; i++){
							arrayfav.push(result[i].FavID);
							arrayfav.push(result[i].Favourite);
							}
							console.log(arrayfav.toString());
						    return response.end(arrayfav.toString());
						

						
						}
											
					});

  		

					});
			
            
          });		  		  		  		  
        });	       
      }
	}	

// dFav	
	   else if(request.url==="/dFav"){
              
        if (request.method === "POST") {
            
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          
		  formData += data;
		  
		  favinfo=formData.split("&");
		  userid=favinfo[1].split("=");
		  favdot=favinfo[2].split("=");
		  favdotarray=favdot[1].split(",");
			
		  
   		  return request.on('end', function() {
            var user;
            user = qs.parse(formData);

            msg = JSON.stringify(user);
			
		  stringMsg = JSON.parse(msg);
		  
		   MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("n123db");
	 				var myobj = stringMsg;

					var query = { id: userid[1], FavID : { $in : favdotarray } };
		
						console.log(query);
					// delete selected fav list items by the user from DB							
					dbo.collection("FavList").deleteMany(query, function(err, result) {

						
						if (err) throw err;						
		
						db.close();
						
											
					});
				});
			
            
          });		  		  		  		  
        });	       
      }
	}	
	

// LOGIN	
	  
	  else if(request.url==="/login"){
              
        if (request.method === "POST") {
        formData = '';
        msg = '';
        return request.on('data', function(data) {
			
		formData += data;
         		  
		  info2=formData.split("&");		  
		  dott3=info2[0].split("=");
		  dott4=info2[1].split("=");
		  console.log(info2);

         		  		   		  
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);

            msg = JSON.stringify(user);
       
		  stringMsg = JSON.parse(msg);
		  
		   MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;
  					var dbo = db.db("n123db");
  					var myobj = stringMsg;
					var query = {email: dott3[1] , password: dott4[1]};
					
					console.log(query);
					//retrieve user data by email address and password of the user from DB
					dbo.collection("customers").findOne(query, function(err, result) {
						
						if (err) throw err;
						console.log(result);
						db.close();					
					
					if (result != null){	
						response.end(result.id);
						
					}
					else
					{
						response.end('');
						
					}
										
					
					
					});

  	
					});			
         
          });
		  
		  
		 		  

        });       
      }
	  else {
         sendFileContent(response, "web.html", "text/html");
             }

             		  
	}else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.min.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.min.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/js");
	}
	else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/jpg");
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/png");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
			}else if(/^\/[a-zA-Z0-9\/-/]*.bundle.min.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
			}else if(/^\/[a-zA-Z0-9\/-/]*.css$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/css");
			}else if(/^\/[a-zA-Z0-9\/-]*.min.css$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/css");
			}else if(/^\/[a-zA-Z0-9\/-/]*.jpg$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "image/jpg");
			}else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
			}else if(/^\/[a-zA-Z0-9-]*.min.css.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
			}else if(/^\/[a-zA-Z0-9\/-/]*.min.js.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
			}else if(/^\/[a-zA-Z0-9\/-/]*.css.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
			}else if(/^\/[a-zA-Z0-9\/-/]*.png$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "image/png");
			}else if(/^\/[a-zA-Z0-9\/-/]*.ico$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/ico");
			}else if(/^\/[a-zA-Z0-9\/-/?]*.ttf$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/font");
			}else if(/^\/[a-zA-Z0-9\/-/?]*.woff$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/woff");
			}else if(/^\/[a-zA-Z0-9\/-/?]*.woff2$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/woff2");
			}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(9999)

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}