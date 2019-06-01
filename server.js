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

app.use(
  login.printURL,
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

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

app.get('/logout', function (req, res) {
  console.log('trying to log out')
  req.logout()
  res.redirect('/login')
})

// Google redirects here after user successfully logs in This route has three
// handler functions, one run after the other.
app.get('/auth/redirect', passport.authenticate('google'), login.loginSuccess)

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'index.html'))
})

app.get('/login', function (req, res, next) {
  res.sendFile(path.join(__dirname, './public', 'login.html'))
})

passport.serializeUser((dbRowID, done) => {
  done(null, dbRowID)
})

passport.deserializeUser(login.deserializeUser)

process.on('exit', function () {
  getDb().close()
})

app.get('/translate', api.translationHandler)
app.get('/store', api.createCardHandler)
app.get('/dump', api.dumpHandler)
app.get('/seen/:id', api.incrementSeenHandler)
app.get('/correct/:id', api.incrementCorrectHandler)
app.get('/get_user', api.getUserHandler)
app.use(api.fileNotFound)

const PORT = process.env.PORT || 51375
// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
initDb(function (err) {
  console.log(err)
  app.listen(PORT, () => console.log('API Up and running on port ' + PORT))
  console.log('inside initDb')
})
