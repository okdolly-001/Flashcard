const getDb = require('./db').getDb

function isAuthenticated (req, res, next) {
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

function gotProfile (accessToken, refreshToken, profile, done) {
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
          getDb().run(
            `INSERT INTO userinfo (google_id,first_name,last_name)VALUES(?,?,?)`,
            [profile.id, profile.name.givenName, profile.name.familyName],
            err => {
              if (err) {
                return console.log('error adding card into database')
              }
              dbRowID = profile.id
              done(null, dbRowID)
            }
          )
        }
      }
    }
  )
}
function loginSuccess (req, res) {
  console.log('Logged in and using cookies!')
  res.redirect('/')
}

function deserializeUser (dbRowID, done) {
  getDb().get(
    `SELECT google_id id, first_name firstName, last_name lastName FROM
    userinfo WHERE google_id = ?`,
    [dbRowID.toString()],
    (err, row) => {
      if (err) {
        console.log(err)
      } else {
        console.log('user row')
        if (row) {
          let userData = {
            google_id: row.id,
            first_name: row.firstName,
            last_name: row.lastName
          }
          done(null, userData)
        } else {
          console.log('deserializer')
          res.redirect('/login')
        }
      }
    }
  )
}

function printURL (req, res, next) {
  console.log(req.url)
  next()
}

module.exports = {
  isAuthenticated,
  gotProfile,
  deserializeUser,
  loginSuccess,
  printURL
}
