// Router to manage "Squadra" submenu
// MEMO: it uses supervars fomr server.js as global variable

// libs
const express = require('express');
const DB = require('./../database.js');

// router instance
const router = express.Router();

// main
router.get('/', (req, res) => {
  // res.render('teams', {
  //   players: SearchResults
  // });
  res.render('market', {
     supervars : supervars
  })
});


// filtra giocatori to home
router.post('/', (req, res) => {

  // request params
  let playerName = req.body.playerName
  let teamName = req.body.teamName
  let playerNation = req.body.playerNation
  let playerPos = req.body.position

  let priceMax = Number(req.body.priceMax)
  let wageMax = Number(req.body.wageMax)
  let etaMin = Number(req.body.etaMin)
  let etaMax = Number(req.body.etaMax)
  let forzaMax = Number(req.body.forzaMax)
  let forzaMin = Number(req.body.forzaMin)

  if (playerName == undefined) {

    console.log("Filter by playerName")
    let sql = "SELECT * FROM players WHERE nome = ?"

    DB.get(sql, playerName, (err, data) => {
      if (err) {
        return console.error(err.message);

      } else {
        res.render('market', {
          supervars : supervars,
          players : [data]
        })
      }
     });

  } else if (teamName == undefined) {

    console.log("Filter by teamName")
    let sql = "SELECT * FROM teams WHERE club_team = ?"
    let sql2 = "SELECT * FROM players WHERE id_team = ?"

    DB.get(sql, teamName, (err, data) => {
      if (err) {
        return console.error(err.message);

      } else {
        DB.all(sql2, data['id_team'], (err2, data2) => {
          if (err2) {
            return console.error(err2.message);
          }
          res.render('market', {
            supervars : supervars,
            players : data2
          })
        })
      }
     });

  } else {

    function getData(params) {
      let sql = "SELECT * \
                  FROM players \
                  WHERE eta >= ? AND eta <= ? AND \
                        valore_e <= ? AND \
                        stipendio_e <= ? AND \
                        valtot >= ? AND valtot <= ? \
                  ORDER BY valtot DESC \
                  LIMIT 50";

      DB.all(sql, params, (err, data) => {
        if (err) {
          return console.error(err.message);

        } else {
          // console.log(params)
          console.log(data)
          res.render('market', {
            supervars : supervars,
            players : data
          })
        }
       });
    }

    // let params = [etaMin, etaMax, priceMax, wageMax, forzaMin, forzaMax]

    function setParams(getData) {

      console.log("Filter by numeric vars")
      console.log("etaMin " + etaMin)
      console.log("etaMax " + etaMax)
      console.log("priceMax " + priceMax)
      console.log("wageMax " + wageMax)
      console.log("forzaMin " + forzaMin)
      console.log("forzaMax " + forzaMax)
      // console.log(typeof(etaMax))

      if (etaMin == 0) {
        let etaMin = 0
      }

      if (etaMax == 0) {
        let etaMax = 100
      }

      if (priceMax == 0) {
        let priceMax = 1000000000
      }

      if (wageMax == 0) {
        let wageMax = 1000000000
      }



      // console.log(etaMin)
      // console.log(typeof(etaMin))
      console.log("-----------------------")
      console.log("etaMin " + etaMin)
      console.log("etaMax " + etaMax)
      console.log("priceMax " + priceMax)
      console.log("wageMax " + wageMax)
      console.log("forzaMin " + forzaMin)
      console.log("forzaMax " + forzaMax)

      params = [etaMin, etaMax, priceMax, wageMax, forzaMin, forzaMax]
      getData(params)

    }


  }
});






















router.get('/shortlist', (req, res) => {
  // res.render('teams', {
  //   players: SearchResults
  // });
  res.render('market', {
     supervars : supervars
  })
});

router.get('/network', (req, res) => {
  // res.render('teams', {
  //   players: SearchResults
  // });
  res.render('market', {
     supervars : supervars
  })
});




module.exports = router;
