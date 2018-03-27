var express = require('express');
var app     = express();
var path    = require('path');
var http    = require('http').Server(app);
var io      = require("socket.io")(http); // app or http
//var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// FIREBASE
var firebase = require("firebase"); // Initialize Firebase
var config = require('./fibConfig');// Load Firebase Config
// console.log(config);
firebase.initializeApp(config);
var database = firebase.database(); // Get a reference to the database service
// END FIREBASE

app.use(express.static(__dirname + '/'));

app.get('/', function (request, response, next) {
  response.sendFile(path.join(__dirname+'/index.html'));
});

io.on('connection', function(socket){

  socket.on('start',function(data,html,p,pName){

    // URL TO SCRAP
    var pid = p;
    var url = data+p; //url = "http://www.aemet.es/es/eltiempo/prediccion/playas?p=15"; // FOR PROT
    //console.log(url);
    var tag = html; //var tag = "#provincia_selector option";
    //console.log("\nREADING URL::",data,html+"\n");
    var province = pName;

    // request({uri:url, encoding: 'utf8'}, function(error, response, html){
    //PLAYAS ESPECIFICO => encoding: 'binary'
    request({uri:url, encoding: 'binary'}, function(error, response, html){

        var respArr = []; // ARRAY DE RESPUESTA

        if(!error){

          //var $ = cheerio.load(html,{ decodeEntities: true,ignoreWhitespace: false,xmlMode: false,lowerCaseTags: false });
          var $ = cheerio.load(html,{ decodeEntities: false});

          // TAGS SEARCHED
          $(tag).filter(function(){

            //console.log(tag);
            var data = $(this);
            
            /* PLAYAS ESPECIFICO */
            /* PROVINCIAS
            var province = data.text();
            var id = data.attr('value');

            if(province!=="...") {
              var obj = {
                country: "Spain",
                id : id,
                name: province
              };
              respArr.push(obj);
              writeFib(obj); // WRITE IN FIREBASE
            }
            END PROVINCIAS */
            /* END PLAYAS ESPECIFICO */

            /* BEACHES */
            var beach = data.html();
            if(beach!=="...") {
              var obj = {
                country: "Spain",
                prov_name: province,
                prov_id: pid,
                city: data.parent().attr('label'),
                full_id: data.attr('value'),
                id : fixObjID(data.attr('value')),
                name: data.text()
              };

              function fixObjID(str) {
                var l = str.lenght;
                var pos = str.lastIndexOf("-") + 1;
                str = str.slice(pos,l);
                return str;
              }

              // console.log(obj);
              respArr.push(obj);
              writeFib(obj); // WRITE IN FIREBASE
            }
            /* END BEACHES */
            
            /* WEB SCRAPPER */
              // respArr.push(data.html());
              // respArr.push(data.text());
            /* END WEB SCRAPPER */

          })


          // DEMO SELECTORS
          /*
          $('.title_wrapper').filter(function(){
            var data = $(this);
            title = data.children().first().text().trim();
            release = data.children().last().children().last().text().trim();

            json.title = title;
            json.release = release;
          })

          $('.ratingValue').filter(function(){
            var data = $(this);
            rating = data.text().trim();

            json.rating = rating;
          })
          */
        }
        // WRITE FILE
        /*
        fs.writeFile(json.provincia+'.json', JSON.stringify(json, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        })
        res.send('Check your console!')
        */
        
        // FRONT ANSWER 
        socket.emit("response",respArr);
        
    });  
  })
//})
});
//END SOCKET IO

function writeFib(obj) {

  console.log(obj);

  /* WRITE PROVINCES
  firebase.database().ref('provinces/').push({
    country: obj.country,
    id: obj.id,
    name: obj.name
  });
  END WRITE PROVINCES */

  /* WRITE CITIES */
  firebase.database().ref('spain/beaches/').push({
    country: obj.country,
    province_name: obj.prov_name,
    province_id: obj.prov_id,
    city: obj.city,
    full_id: obj.full_id,
    id : obj.id,
    name: obj.name
  });
  /* END WRITE CITIES */
}

http.listen(process.env.PORT || 3000, function () {
  console.log('- START SERVER - - - - - -\n');
  console.log('Server Listening on http://localhost:' + (process.env.PORT || 3000))
});

/*
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
*/