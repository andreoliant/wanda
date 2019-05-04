// Router to manage "Squadra" submenu
// MEMO: it uses supervars fomr server.js as global variable

// libs
const express = require('express');

// router instance
const router = express.Router();

// load team (TEMP)
const playersIndex = require('../data/team_index.json');

var getSearchResults = playersIndex => {
  let playerFile = "";
  let searchResults = [];
  for (const player in playersIndex) {
    let playerFilePath = playersIndex[player];
    let playerFile = require("." + `${playerFilePath}`);
    playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ');
    playerFile.photo = "." + playerFile.photo;
    playerFile.club.logo = "." + playerFile.club.logo;
    searchResults.push(playerFile);
    // console.log(searchResults);
  }
  return searchResults;
};

setSupervars(supervars, "SearchResults", getSearchResults(playersIndex))


// rosa
router.get('/', (req, res) => {
  // res.render('teams', {
  //   players: SearchResults
  // });
  res.render('teams', {
     supervars : supervars
  })
});


// lineup
// MEMO: lineup.pug loads lineup.js from static/js/
// then React components call the APIs for players and tactic
router.get('/lineup', (req, res) => {
  res.render('lineup');
});

// API per lineup
// TODO: redefine API url
// API > team
router.get('/lineup/api/players/:team', (req, res) => {
  var team = req.params.team;
  // console.log(team);
  if (team === "myteam") {
    // console.log(SearchResults);
    let data = supervars.SearchResults;
    res.json(data);
  };
  console.log('Sent searchResults to client');
});

// API > selected players
router.get('/lineup/api/selected/:team', (req, res) => {
  var team = req.params.team;
  // console.log(team);
  if (team === "myteam") {
    // console.log(SearchResults);
    let data = supervars.savedLineup;
    res.json(data);
  };
  console.log('Sent savedLineup to client');
});

// TODO: qui va post API che raccoglie selected players

// API > tattica
router.get('/lineup/api/tactic/:tactic', (req, res) => {
  var reqTactic = req.params.tactic
  // console.log(req.params.tactic)
  if (reqTactic == 'default') {
    var tactic = supervars.activeTacticName
    let data = require(`../public/tactics/${tactic}.json`);
    let data2 = {
      tacticName : tactic,
      tacticData : data
    }
    res.json(data2);
    console.log(data2)
  } else {
    var tactic = reqTactic
    let data = require(`../public/tactics/${tactic}.json`);
    let data2 = {
      tacticName : tactic,
      tacticData : data
    }
    res.json(data2);
  };



  setSupervars(supervars, "activeTacticName", tactic)
  console.log('Sent activeTactic to client');
});

// aggiunge payer (per player positioning nel pith)
router.post('/lineup/api/add-player', (req, res) => {
  // console.log(req.body)

  let newPlayer = req.body

  let data = supervars.savedLineup

  let appo = []
  for (const i in data) {
    let player = data[i]
    if (player.id != newPlayer.id) {
      appo.push(player)
    }
  }
  appo.push(newPlayer)

  setSupervars(supervars, "savedLineup", appo)
  // console.log(supervars.savedLineup);
  console.log('Player added')
});

// elmina player (per move-out su pith)
router.post('/lineup/api/rm-player', (req, res) => {
  // console.log(req.body)

  let newPlayer = req.body

  let data = supervars.savedLineup

  let appo = []
  for (const i in data) {
    let player = data[i]
    if (player.id != newPlayer.id) {
      appo.push(player)
    }
  }

  setSupervars(supervars, "savedLineup", appo)
  // console.log(supervars.savedLineup);
  console.log('Player removed')
});


// TODO:
// inserire placeholder per figure e lazyload
//inserire link a pagina player
// deve esserci post quando esco da lineup per salvare state

module.exports = router;
