// Make DB connection

// db setup
const sqlite3 = require('sqlite3').verbose();
// const DB_PATH = ':memory:';
const DB_PATH = './db/wanda.sqlite';

// db init
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH)

    // DB.serialize(() => {
    //   DB.each(`SELECT PlaylistId as id,
    //                   Name as name
    //            FROM playlists`, (err, row) => {
    //     if (err) {
    //       console.error(err.message);
    //     }
    //     console.log(row.id + "\t" + row.name);
    //   });
    // });

    // let sql = "select name from sqlite_master where type='table'"
    // DB.get(sql, (err, tables) => {
    //   if (err) {
    //     return console.error(err.message);
    //   }
    //   console.log(tables);
    // });



    // foreign keys
    // DB.exec('PRAGMA foreign_keys = ON;', function(error)  {
    //     if (error){
    //         console.error("Pragma statement didn't work.")
    //     } else {
    //         console.log("Foreign Key Enforcement is on.")
    //     }
    // });
});

module.exports = DB;
