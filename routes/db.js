const sqlite3 = require('sqlite3').verbose()
let db = null;
function initDb (callback) {
  if (db) {
    return callback(null, db)
  }
  db = new sqlite3.Database('./FlashCards.db')

  return callback(null, db)
}
 
function getDb () {
  if (!db) {
    return
  }

  return db
}
module.exports = {
  getDb,
  initDb
}
