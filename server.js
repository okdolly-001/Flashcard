const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
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

app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }))

app.use(passport.initialize())

app.use(passport.session())

app.use(
  login.isAuthenticated,
  webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: 'errors-only',
    noInfo: true,
    historyApiFallback: false
  })
)
app.use('/', login.printURL)
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

app.get('/logout', function (req, res) {
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
app.get('/seen/:id/', api.incrementSeenHandler)
app.get('/correct/:id/', api.incrementCorrectHandler)
app.get('/dump', api.dumpHandler)
app.get('/get_user', api.getUserHandler)
app.use(api.fileNotFound)

const PORT = process.env.PORT || 51375
initDb(function (err) {
  if (err) console.log(err)
  app.listen(PORT, () => console.log('API Up and running on port ' + PORT))
})
