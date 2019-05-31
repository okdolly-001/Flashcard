const getDb = require('./db').getDb
const db = getDb()

function isAuthenticated(req, res, next) {
  if (req.user) {
    console.log('Req.session:', req.session)
    console.log('Req.user:', req.user)
    next()
    return
  } else if (req.originalUrl === '/') {
    console.log('not logged in ?')
    res.redirect('/login')
    return
  }
  next()
}

function gotProfile(accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile)
  let dbRowID = 0
  getDb().get(
    `SELECT google_id id, first_name firstName, last_name lastName FROM userinfo WHERE google_id = ?`,
    [profile.id],
    (err, row) => {
      if (err) {
        console.log(err)
      } else {
        if (row) {
          dbRowID = row.id
          done(null, dbRowID)
        } else {
          console.log('gotProfile need to store here')
          db.run(
            `INSERT INTO userinfo (google_id,first_name,last_name)VALUES(?,?,?)`,
            [profile.id, profile.name.givenName, profile.name.familyName],
            err => {
              if (err) {
                return console.log('error adding card into database')
              }
              dbRowID = profile.id
              console.log(
                'dbRow id is ' +
                  dbRowID +
                  ' ' +
                  profile.name.givenName +
                  ' ' +
                  profile.name.familyName
              )
              console.log('gotProfile row id is ' + dbRowID)
              done(null, dbRowID)
            }
          )
        }
      }
    }
  )
}


module.exports = {
  isAuthenticated,
  gotProfile
}
