const express = require('express');

const teams = require('./routes/teams');

const app = express();

// use template engine
app.set('view engine', 'pug');

// serve static files from the `public` folder
app.use(express.static(__dirname + '/public'));

// route to homepage
app.get('/', (req, res) => {
  res.render('index');
  // res.send('Hello World! Supercazzola');
});

// use routes
app.use('/teams', teams)
// MEMO: dentro teams.js la root corrisponde a /teams/

// setup dev server
// const server = app.listen(7000, () => {
//   console.log(`Express running → PORT ${server.address().port}`);
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on http://localhost:${port}/`));
