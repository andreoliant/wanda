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


function getData(res, sql, queryVars) {
  DB.all(sql, queryVars, (err, data) => {
    if (err) {
      return console.error(err.message);

    } else {
      // console.log(queryVars)
      // console.log(data.length)
      res.render('market', {
        supervars : supervars,
        players : data
      });
    }
  });
}

// filtra giocatori to home
router.post('/', (req, res) => {

  console.log(req.body)

  // request params
  var playerName = req.body.playerName
  var teamName = req.body.teamName
  var playerNation = req.body.playerNation
  var playerPos = req.body.position

  if (playerName != '') {

    console.log("Filter by playerName")
    let sql = "SELECT * FROM players WHERE nome = ?"

    getData(res, sql, playerName)

  } else if (teamName != '') {
    // TODO: rifare con join!!!

    console.log("Filter by teamName")

    let sql = "SELECT * \
                FROM players \
                INNER JOIN teams \
                ON players.id_team = teams.id_team \
                WHERE teams.club_team = ?";

    getData(res, sql, teamName)

  } else if (playerNation != '') {

    console.log("Filter by playerNation")

    let sql = "SELECT * \
                FROM players \
                WHERE naz = ? \
                ORDER BY valtot DESC \
                LIMIT 50"

    getData(res, sql, playerName)

  } else {

    console.log("Filter by numeric vars")

    let sql = "SELECT * \
                FROM players \
                WHERE eta >= ? AND eta <= ? AND \
                      valore_e <= ? AND \
                      stipendio_e <= ? AND \
                      valtot >= ? AND valtot <= ? \
                ORDER BY valtot DESC \
                LIMIT 50";

    function setQueryVars(reqBody) {

      var priceMax = Number(req.body.priceMax)
      var wageMax = Number(reqBody.wageMax)
      var etaMin = Number(reqBody.etaMin)
      var etaMax = Number(reqBody.etaMax)
      var forzaMax = Number(reqBody.forzaMax)
      var forzaMin = Number(reqBody.forzaMin)

      console.log("etaMin " + etaMin)
      console.log("etaMax " + etaMax)
      console.log("priceMax " + priceMax)
      console.log("wageMax " + wageMax)
      console.log("forzaMin " + forzaMin)
      console.log("forzaMax " + forzaMax)
      // console.log(typeof(etaMax))

      if (etaMin == undefined) {
        var etaMin = 0
      }

      if (etaMax == undefined) {
        var etaMax = 100
      } else if (etaMax == 0) {
        var etaMax = 100
      }

      if (priceMax == undefined) {
        var priceMax = 1000000000
      } else if (priceMax == 0) {
        var priceMax = 1000000000
      }

      if (wageMax == undefined) {
        var wageMax = 1000000000
      } else if (wageMax == 0) {
        var wageMax = 1000000000
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
      return(params)

    }

    // let params = [etaMin, etaMax, priceMax, wageMax, forzaMin, forzaMax]

    // main function (setup query params)
    function queryPlayers(reqBody) {
      getData(res, sql, setQueryVars(reqBody))
    }

    // getData(res, sql, playerName)

    // execution
    queryPlayers(req.body)

  }
});









// pagina per player
router.get('/player/:player', (req, res) => {

  let sql = "SELECT * FROM players WHERE id=?"

  DB.get(sql, req.params.player, (err, thisPlayer) => {
    if (err) {
      return console.error(err.message);
    }

    res.render('player', {
       supervars : supervars,
       player : thisPlayer,
       origin : "market"
    })
    // console.log(thisPlayer);
    // res.send(thisPlayer);
  });
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
