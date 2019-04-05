const express = require('express');

const router = express.Router();

// load team
const playersIndex = require('../data/team_index.json');

// getPlayerFile = playerFilePath => {
//     var appo = ".";
//     return require(appo + `${playerFilePath}`);
//   };

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

const SearchResults = getSearchResults(playersIndex);

// rosa
router.get('/', (req, res) => {
  res.render('teams', {
    players: SearchResults
  });
});

// lineup
router.get('/lineup', (req, res) => {
  res.render('lineup', {
    players: SearchResults
  });
});

// API > team
router.get('/lineup/api/players/:team', (req, res) => {
  var team = req.params.team;
  // console.log(team);
  if (team === "myteam") {
    console.log(SearchResults);
    let data = SearchResults;
    res.json(data);
  };
  console.log('Sent searchResults to client');
});

// API > tattica
router.get('/lineup/api/tactic/:tactic', (req, res) => {
  var tactic = req.params.tactic;
  let data = require(`../public/tactics/${tactic}.json`);
  res.json(data);
  console.log('Sent activeTactic to client');
});

// TODO:
// inserire placeholder per figure e lazyload
//inserire link a pagina player
// deve esserci post quando esco da lineup per salvare state

module.exports = router;
