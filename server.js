var express = require('express');
var app     = express();
var path    = require('path');
var http    = require('http').Server(app);
var io      = require("socket.io")(http); // app or http
//var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

app.use(express.static(__dirname + '/'));

app.get('/', function (request, response, next) {
  response.sendFile(path.join(__dirname+'/index.html'));
});

io.on('connection', function(socket){

  socket.on('start',function(data,html){

    // URL TO SCRAP
    var url = data; //url = "http://www.aemet.es/es/eltiempo/prediccion/playas?p=15"; // FOR PROT
    var tag = html; //var tag = "#provincia_selector option";
    //console.log("\nREADING URL::",data,html+"\n");

    request({uri:url, encoding: 'binary'}, function(error, response, html){

        var respArr = [];

        if(!error){

          //var $ = cheerio.load(html,{ decodeEntities: true,ignoreWhitespace: false,xmlMode: false,lowerCaseTags: false });
          var $ = cheerio.load(html,{ decodeEntities: false});

          //PROVINCIA
          $(tag).filter(function(){

            //console.log(tag);
            var data = $(this);
            
            /* PLAYAS ESPECIFICO
            var provincia = data.text();
            var id = data.attr('value');

            if(provincia!=="...") {
              var obj = {
                id : id,
                nombre: provincia
              };
              //obj[provincia] = id;
              respArr.push(obj);
              //console.log("DATA SCRPD:",obj);
            }
            */

            respArr.push(data.html());

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
        socket.emit("response",respArr);
        
    });  
  })
//})
});
//END SOCKET IO

http.listen(process.env.PORT || 3000, function () {
  console.log('- START SERVER - - - - - -\n');
  console.log('Server Listening on http://localhost:' + (process.env.PORT || 3000))
});

/*
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
*/