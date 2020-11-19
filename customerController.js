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
      var sopiva = true;
      var virheet = {'virhe' : [null,null,null,null,null]};

      if(req.body.nimi == null || req.body.nimi == ''){
        virheet.virhe[0] = 'nimi';
        sopiva = false;
      }
      if(req.body.osoite == null || req.body.osoite == ''){
        virheet.virhe[1] = 'osoite';
        sopiva = false;
      }
      if(req.body.postinro == null || req.body.postinro == ''){
        virheet.virhe[2] = 'postinro';
        sopiva = false;
      }
      if(req.body.postitmp == null || req.body.postitmp == ''){
        virheet.virhe[3] = 'postitmp';
        sopiva = false;
      }
      if(req.body.asty_avain == null || req.body.asty_avain == ''){
        virheet.virhe[4] = 'asty_avain';
        sopiva = false;
      }

      if(!sopiva){
        res.status(400);
        res.json(virheet);
        return;
      }

      var rightNow = new Date();
      var query = `INSERT INTO Asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) values ('${req.body.nimi}',
        '${req.body.osoite}','${req.body.postinro}', '${req.body.postitmp}', '${rightNow.toISOString().slice(0,10).replace(/-/g,"")}' ,'${req.body.asty_avain}');`;
      connection.query(query, function(error, results){
        if ( error ){
          console.log('Virhe haettaessa dataa Asiakas-taulusta: ' + error);
          res.status(500);
          res.json({'status' : 'ei toimi'})
        }
        else
        {
          res.json(results); //Onnistunut lisäys
        }
      }
      )},
  

    update: function(req, res){
      
    },

    delete : function (req, res) {
      
      connection.query('DELETE FROM Asiakas WHERE AVAIN=' + req.params.id +';', function(error, results, fields){
        if ( error ){
          console.log('Virhe haettaessa dataa Asiakas-taulusta: ' + error);
          res.status(500);
          res.json({'status' : 'ei toimi'});
        }
        else
        {
          console.log('Asiakas poistettu. Data = ' + JSON.stringify(results));
          res.json(results); //Onnistunut haku tietokannasta, lähetetään data sitä pyytäneelle (usein selain)
        }
      });
    }
}
