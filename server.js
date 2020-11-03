var express = require('express'); 
var fs = require("fs");
var util=require('util');
const http = require('http');
const url = require('url');
var bodyParser = require('body-parser');

var customerController = require('./customerController');

var app=express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    // Jos haluttaisiin rajata hakuja joidenkin ehtojen perusteella, niin määritettäisiin näin: 
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

// Otetaan käyttöön CORS säännöt:
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //* ...jsonina


// Staattiset tiedostot, esim. kuvat, tyylitiedostot, scriptit käyttöliittymää varten
app.use(express.static('public'));

// REST API Asiakas
app.route('/Types') // route reitittää pyynnön merkkijonon ja metodin perusteella customerControlleriin
    .get(customerController.fetchTypes)
    .post((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end("post-metodilla menty");
    })


app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/Asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete);
//

app.get('/', function(request, response){
    fs.readFile("node.html", function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();    
    });
});

app.get('/maali', function(request, response){
    console.log(request.headers);
    console.log(request.url);
    console.log(request.method);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Maaleja pukkaa"); 
});


app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Server running AT http://${port}/`);
  });
*/  