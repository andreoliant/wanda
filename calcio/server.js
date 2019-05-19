// Main script for the webserver

// init
const express = require('express');
const app = express();

// load db connection
const DB = require('./database.js');

// use template engine
app.set('view engine', 'pug');

// serve static files from the `public` folder
app.use(express.static(__dirname + '/public'));

// middleware to get post params
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// supervars (as global variable)
supervars = {
  managerName: '',
  teamId: '',
  teamName: '',
  leagueId: '',
  leagueName: '',
  SearchResults: [],
  activeTacticName: '433',
  savedLineup: []
};
// id_team: '000044',
//   club_team: 'Inter',
//   id_league: '0031',
//   nome_lega: 'Serie A TIM'
// savedLineup: [{id: "158023", position: "P10"},
//               {id: "138956", position: "P04"}]

// set data in supervars (function as global variable)
setSupervars = (supervars, variable, value) => {
  // supervars.variable = value
  supervars[variable] = value
  return supervars
};
// setSupervars(supervars, "managerName", "pop")
// console.log(supervars.managerName)



// dbSchema = `CREATE TABLE IF NOT EXISTS Supervars (
//         id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
//         managerName text NOT NULL UNIQUE,
//         teamName text NOT NULL UNIQUE
//     );`
//
// DB.exec(dbSchema, function(err){
//     if (err) {
//         console.log(err)
//     }
// });





// game start (select manager & team)
app.get('/', (req, res) => {
  res.render('start');
});

// redirect to home
app.post('/', (req, res) => {
  // init db and cache

  setSupervars(supervars, "managerName", req.body.managerName)
  setSupervars(supervars, "teamName", req.body.teamName)

  // get teamId an league
  let sql = "SELECT * FROM teams WHERE club_team = ?"
  let sql2 = "SELECT * FROM players WHERE id_team = ?"

  DB.get(sql, req.body.teamName, (err, data) => {
    if (err) {
      return console.error(err.message);

    } else {

      DB.all(sql2, data['id_team'], (err2, data2) => {
        if (err2) {
          return console.error(err2.message);
        }
        // console.log(data2)
        setSupervars(supervars, "SearchResults", data2)
        // console.log(supervars)
        })
      // let team = data['id_team']
      // console.log(team)

        setSupervars(supervars, "teamId", data['id_team'])
        setSupervars(supervars, "leagueId", data['id_league'])
        setSupervars(supervars, "leagueName", data['nome_lega'])

        // let team = supervars['teamId']
      }

        // res.render('home', {
        //    managerName : supervars.managerName,
        //    teamName : supervars.teamName
        //  })
      res.render('home', {
        supervars : supervars
      })
    })
});


// route (back) to home
app.get('/home', (req, res) => {
  // let sql = `SELECT managerName,
  //                   teamName
  //           FROM Supervars`;
  //
  // // first row only
  // DB.get(sql, (err, row) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  //   return row
  //     ? res.render('home', {
  //         managerName : row.managerName,
  //         teamName : row.teamName
  //       })
  //     : console.log(`Nessun manager registrato`);
  // });

  // res.render('home', {
  //     managerName : supervars.managerName,
  //     teamName : supervars.teamName
  //   })
  res.render('home', {
     supervars : supervars
  })
});




app.get('/auto-team', (req, res) => {
  // var tempTeam = req.params.team;
  var tempTeam = '%' + req.query.team + '%';
  // console.log(tempTeam)

  let sql = "SELECT club_team FROM teams WHERE club_team LIKE ?"

  DB.all(sql, tempTeam, (err, data) => {
    if (err) {
      return console.error(err.message);
    }
    let teams = []
    for (const i in data) {
      let team = data[i]['club_team']
      teams.push(team)
      }
    // console.log(teams)
    res.json({
      results : teams
    });
  })
});

app.get('/auto-player', (req, res) => {
  // var tempTeam = req.params.team;
  var tempPlayer = '%' + req.query.player + '%';
  // console.log(tempTeam)
  console.log(tempPlayer)

  let sql = "SELECT nome FROM players WHERE nome LIKE ?"

  DB.all(sql, tempPlayer, (err, data) => {
    if (err) {
      return console.error(err.message);
    }
    let players = []
    for (const i in data) {
      let player = data[i]['nome']
      players.push(player)
      }
    // console.log(teams)
    res.json({
      results : players
    });
    })
});



// use routes (must be after the supervars global variable!)
const team = require('./routes/team');
app.use('/team', team)
// MEMO: dentro teams.js la root corrisponde a /teams/
const market = require('./routes/market');
app.use('/market', market)

// setup dev server
// const server = app.listen(7000, () => {
//   console.log(`Express running → PORT ${server.address().port}`);
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on http://localhost:${port}/`));
