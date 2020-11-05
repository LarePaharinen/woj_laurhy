'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost', //Tietokantapalvelimen osoite (Ei aina samassa osoitteessa kuin palvelin (localhost))
  port : 3306, 
  user : 'root', // Kehitystarkoituksessa voidaan käyttää root-käyttäjää. Tuotannossa ei IKINÄ!!!
  password : '',  // Voi olla tyhjäkin
  database : 'asiakas'
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log('Virhe haettaessa dataa Asiakas-taulusta: ' + error);
          res.status(500);
          res.json({'status' : 'ei toimi'});
        }
        else
        {
          res.json(results); //Onnistunut haku tietokannasta, lähetetään data sitä pyytäneelle (usein selain)
        }
    });

    },

    fetchAll: function(req, res){
      
      var $query = 'SELECT * FROM ASIAKAS';

      
      var $where = '';

      if(req.query.nimi != undefined)
        $where +=  ` WHERE nimi LIKE "%${req.query.nimi}%"`;
      if(req.query.osoite != undefined)
        if($where != '')
          $where += ` AND osoite like '%${req.query.osoite}%'`;
        else
          $where += ` WHERE osoite LIKE '%${req.query.osoite}%'`;
      if(req.query.asty_avain != undefined && req.query.asty_avain != 'all')
        if($where != '')
          $where += ' AND ASTY_AVAIN='+req.query.asty_avain;
        else
          $where += ' WHERE ASTY_AVAIN='+req.query.asty_avain;

      connection.query($query+$where+';', function(error, results, fields){ 
        if ( error ){
          console.log('Virhe haettaessa dataa Asiakas-taulusta: ' + error);
          res.status(500);
          res.json({'status' : 'ei toimi'});
          }
        else{
          res.json(results); //Onnistunut haku tietokannasta, lähetetään data sitä pyytäneelle (usein selain)
        }
      });
      
    },
    

    create: function(req, res){
      console.log("Data = " + JSON.stringify(req.body));
      console.log(req.body.nimi);
      res.send("Kutsuttiin create");
    },

    update: function(req, res){
      
    },

    delete : function (req, res) {
      connection.query('DELETE FROM Asiakas WHERE AVAIN="' + req.params.id +'";', function(error, results, fields){
        if ( error ){
          console.log('Virhe haettaessa dataa Asiakas-taulusta: ' + error);
          res.status(500);
          res.json({'status' : 'ei toimi'});
        }
        else
        {
          console.log('Data = ' + JSON.stringify(results));
          res.json(results); //Onnistunut haku tietokannasta, lähetetään data sitä pyytäneelle (usein selain)
        }
      });
    }
}
