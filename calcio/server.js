// Main script for the webserver

// init
const express = require('express');
const app = express();

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
  teamName: '',
  SearchResults: [],
  activeTacticName: '433',
  savedLineup: []
};

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

// db setup
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = ':memory:';

// db init
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')

    // foreign keys
    // DB.exec('PRAGMA foreign_keys = ON;', function(error)  {
    //     if (error){
    //         console.error("Pragma statement didn't work.")
    //     } else {
    //         console.log("Foreign Key Enforcement is on.")
    //     }
    // });
});

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

  // store manager & team as variables
  // const managerName = req.body.managerName
  // const teamName = req.body.teamName
  // DB.run('INSERT INTO Supervars(managerName, teamName) VALUES(?, ?)', [managerName, teamName], (err) => {
  // 	if(err) {
  // 		return console.log(err.message);
  // 	}
  // 	console.log('Row was added to the table: ${this.lastID}');
  //   res.render('home', {
  //     managerName : managerName,
  //     teamName : teamName
  //   });
  // })
  // let supervars.managerName = req.body.managerName;
  // let supervars.teamName = req.body.teamName;
  setSupervars(supervars, "managerName", req.body.managerName)
  setSupervars(supervars, "teamName", req.body.teamName)

  // res.render('home', {
  //    managerName : supervars.managerName,
  //    teamName : supervars.teamName
  //  })
   res.render('home', {
      supervars : supervars
   })

  // res.send('Hello World! Supercazzola');
  // res.redirect('home')
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

// use routes (must be after the supervars global variable!)
const teams = require('./routes/teams');
app.use('/teams', teams)
// MEMO: dentro teams.js la root corrisponde a /teams/

// setup dev server
// const server = app.listen(7000, () => {
//   console.log(`Express running → PORT ${server.address().port}`);
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on http://localhost:${port}/`));
