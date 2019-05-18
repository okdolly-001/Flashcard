const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const APIrequest = require('request')
const sqlite3 = require('sqlite3').verbose() // use sqlite

const APIkey = 'AIzaSyDYVXJk5OlJH9Z-2u3F5ug97owuDdZOf3E' // ADD API KEY HERE
const url =
  'https://translation.googleapis.com/language/translate/v2?key=' + APIkey

const compiler = webpack(webpackConfig)
const db = new sqlite3.Database('FlashCards.db')

function reqTranslation (item, res) {
  let requestObject = {
    source: 'en',
    target: 'ko',
    q: [item]
  }
  // callback function, called when data is received from API
  function APIcallback (err, APIresHead, APIresBody) {
    // gets three objects as input
    if (err || APIresHead.statusCode != 200) {
      // API is not working
      console.log('Got API error')
      console.log(APIresBody)
    } else {
      if (APIresHead.error) {
        // API worked but is not giving you data
        console.log(APIresHead.error)
      } else {
        res.json({
          english: requestObject.q[0],
          translated: APIresBody.data.translations[0].translatedText
        })
        console.log('\n\nJSON was:')
        console.log(JSON.stringify(APIresBody, undefined, 2))
      }
    }
  } // end callback function
  APIrequest(
    {
      // HTTP header stuff
      url: url,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // will turn the given object into JSON
      json: requestObject
    },
    // callback function for API request
    APIcallback
  )
}

function createCardHandler (req, res, next) {
  let qObj = req.query
  console.log("store ", qObj)
  if (qObj != undefined) {
    db.run(
      `INSERT INTO flashcards (user, english, korean, seen, correct)VALUES(?,?,?,?,?)`,
      [1, req.query.english, req.query.korean, 0, 0],
      err => {
        if (err) {
          return console.log('error adding card into database')
        }
        console.log('Row was added to the table: ${this.lastID}')
      }
    )
  } else {
    next()
  }
}
function dumpHandler () {
  db.all('SELECT * FROM flashcards', dataCallback)
  function dataCallback (err, data) {
    console.log(data)
  }
}

function translationHandler (req, res, next) {
  let qObj = req.query
  console.log(req.query)
  if (qObj != undefined) {
    reqTranslation(qObj.english, res)
  } else {
    next()
  }
}

function fileNotFound (req, res) {
  let url = req.url
  res.type('text/plain')
  res.status(404)
  res.send('Cannot find ' + url)
}
// Code needed for closing database
process.on('exit', function () {
  // any shutdown logic here
  db.close()
})

const app = express()

app.use(
  webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
      colors: true
    },
    historyApiFallback: true
  })
)

app.use(express.static(__dirname + '/public'))
app.get('/translate', translationHandler)
app.get('/store', createCardHandler)
app.get('/dump', dumpHandler)

app.use(fileNotFound) // otherwise not found

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
