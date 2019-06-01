// Globals
var sqlite3 = require('sqlite3').verbose() // use sqlite
var fs = require('fs')

var dbFileName = 'FlashCards.db'
// makes the object that represents the database in our code
var db = new sqlite3.Database(dbFileName)

// Initialize table. If the table already exists, causes an error. Fix the error
// by removing or renaming PhotoQ.db
var cmdStr = `CREATE TABLE flashcards (card INT, google_id TEXT, english TEXT, korean TEXT, seen INT, correct INT )`
var cmdStr2 = `CREATE TABLE userinfo (google_id TEXT PRIMARY KEY UNIQUE, first_name TEXT, last_name TEXT)`

db.run(cmdStr, tableCreationCallback)

// Always use the callback for database operations and print out any error
// messages you get.
function tableCreationCallback(err) {
  if (err) {
    console.log('Table creation error', err)
  } else {
    console.log('Database created')
    db.run(cmdStr2, tableCreationCallback2)
  }
}

function tableCreationCallback2(err) {
  if (err) {
    console.log('Table creation error', err)
  } else {
    console.log('Database created')
    db.close()
  }
}
