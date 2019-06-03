const APIrequest = require('request')
const APIkey = 'AIzaSyDYVXJk5OlJH9Z-2u3F5ug97owuDdZOf3E'
const url =
  'https://translation.googleapis.com/language/translate/v2?key=' + APIkey
const getDb = require('./db').getDb

function translationHandler (req, res, next) {
  let qObj = req.query
  if (qObj != undefined) {
    reqTranslation(qObj.english, res)
  } else {
    next()
  }
}

function reqTranslation (item, res) {
  let requestObject = {
    source: 'en',
    target: 'zh-CN',
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
  if (req.user) {
    if (req.query != undefined) {
      getDb().run(
        `INSERT INTO flashcards (google_id, english, chinese, seen, correct)VALUES(?,?,?,?,?)`,
        [req.user.google_id, req.query.english, req.query.chinese, 0, 0],
        err => {
          if (err) {
            console.log(err)
          } else {
            res.json({
              message: 'store successfully',
              english: req.query.english,
              chinese: req.query.chinese
            })
          }
        }
      )
    }
  } else {
    res.redirect('/login')
  }
}

function dumpHandler (req, res, next) {
  if (req.user) {
    getDb().all(
      'SELECT * FROM flashcards WHERE google_id = ?',
      [req.user.google_id],
      dataCallback
    )
    function dataCallback (err, data) {
      res.json({ data: data })
    }
  } else {
    res.redirect('/login')
  }
}

function getUserHandler (req, res) {
  if (req.user) {
    res.json({ name: req.user.first_name, google_id: req.user.google_id })
  } else {
    res.redirect('/login')
  }
}

function incrementSeenHandler (req, res) {
  if (req.user) {
    getDb().run(
      'UPDATE flashcards SET seen = seen + 1 WHERE id = ?',
      [req.params.id],
      dataCallback
    )
    function dataCallback (err) {
      if (err) {
        console.log(err.message)
      }
      return res.sendStatus(200)

    }
  } else {
    res.redirect('/login')
  }
}

function incrementCorrectHandler (req, res) {

  if (req.user) {
    getDb().run(
      'UPDATE flashcards SET correct = correct + 1 WHERE id = ?',
      [req.params.id],
      dataCallback
    )
    function dataCallback (err) {
      if (err) {
        console.log(err.message)
      }
       return res.sendStatus(200)
    }
  } else {
    res.redirect('/login')
  }
}

function fileNotFound (req, res) {
  let url = req.url
  res.type('text/plain')
  res.status(404)
  res.send('Cannot find ' + url)
}

module.exports = {
  translationHandler,
  dumpHandler,
  createCardHandler,
  reqTranslation,
  incrementSeenHandler,
  incrementCorrectHandler,
  fileNotFound,
  getUserHandler
}
