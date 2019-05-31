const sqlite3 = require('sqlite3').verbose()
let db
function initDb (callback) {
  if (db) {
    console.warn('Trying to init DB again!')
    return callback(null, db)
  }
  db = new sqlite3.Database('./FlashCards.db')
  return callback(null, db)
}

function getDb () {
  if (!db) {
    console.warn('DB is not initiated!')
    return
  }
  return db
}
module.exports = {
  getDb,
  initDb
}
