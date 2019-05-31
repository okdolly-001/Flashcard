const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const getDb = require('./routes/db').getDb
const initDb = require('./routes/db').initDb

const db = getDb()
const api = require('./routes/api')
const login = require('./routes/login')
const compiler = webpack(webpackConfig)

const googleLoginData = {
  clientID:
    '62580539901-t6ceuclge0239q85nnudd74rgu7od93t.apps.googleusercontent.com',
  clientSecret: 'KYATJuneMmk3OItFZqBuOyeq',
  callbackURL: '/auth/redirect'
}

passport.use(new GoogleStrategy(googleLoginData, login.gotProfile))
const path = require('path')
const app = express()

app.use('/css', express.static('src/css'))

app.use(cookieParser())
app.use(bodyParser())

app.use(session({ secret: 'anything' }))

app.use(passport.initialize())

app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

// Google redirects here after user successfully logs in This route has three
// handler functions, one run after the other.
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
  login.isAuthenticated,
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
// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
initDb(function (err) {
  console.log(err);
  app.listen(PORT, () => console.log('API Up and running on port ' + PORT))
  console.log('inside initDb')
})
