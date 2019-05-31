const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const sqlite3 = require('sqlite3').verbose()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const db = new sqlite3.Database('FlashCards.db')
const api = require('./api.js')
const compiler = webpack(webpackConfig)

const googleLoginData = {
  clientID:
    '62580539901-t6ceuclge0239q85nnudd74rgu7od93t.apps.googleusercontent.com',
  clientSecret: 'KYATJuneMmk3OItFZqBuOyeq',
  callbackURL: '/auth/redirect'
}

passport.use(new GoogleStrategy(googleLoginData, gotProfile))
const path = require('path')
const app = express()
app.use('/css', express.static('src/css'))

app.use(cookieParser())
app.use(bodyParser())

app.use(session({ secret: 'anything' }))

app.use(passport.initialize())

app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other.
app.get(
  '/auth/redirect',
  function (req, res, next) {
    console.log('at auth/redirect')
    next()
  },
  passport.authenticate('google'),
  function (req, res) {
    console.log('Logged in and using cookies!')
    res.redirect('/')
  }
)

app.use(
  printURL,
  isAuthenticated,
  webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
      colors: true
    },
    historyApiFallback: false
  })
)

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

// middleware functions
function printURL (req, res, next) {
  console.log(req.url)
  next()
}

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'))
})

app.get('/login', function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'login.html'))
})

function gotProfile (accessToken, refreshToken, profile, done) {
  console.log('Google profile', profile)
  let dbRowID = 0
  db.get(
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

passport.serializeUser((dbRowID, done) => {
  done(null, dbRowID)
})

passport.deserializeUser((dbRowID, done) => {

  db.get(
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
})

// Code needed for closing database
process.on('exit', function () {
  // any shutdown logic here
  db.close()
})

app.get('/translate', api.translationHandler)
app.get('/store', api.createCardHandler)
app.get('/dump', api.dumpHandler)
app.get('/get_user', api.getUserHandler)
app.use(api.fileNotFound)

const PORT = process.env.PORT || 51375
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
