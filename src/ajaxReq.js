'strict mode'

function showTranlsate (json) {
  let item = document.getElementById('output')
  item.innerHTML = json.translated
}
// Translate and store if save is pressed
function newStore () {
  let item = document.getElementById('word').value
  makeRequest(1, item)
}

// Translate if enter is pressed
document.getElementById('word').onkeydown = function (event) {
  if (event.keyCode >= 65 || event.keyCode <= 91 || event.keyCode == 13) {
    let item = document.getElementById('word').value
    makeRequest(0, item)
  }
}
// Create the XHR object.
function createRequest (method, url) {
  let xhr = new XMLHttpRequest()
  xhr.open(method, url, true) // call its open method
  return xhr
}

// Make the actual CORS request.
function makeRequest (key, item) {
  let url = `translate?word=${item}`
  let xhr = createRequest('GET', url)

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported')
    return
  }

  // Load some functions into response handlers.
  xhr.onload = function () {
    let responseStr = xhr.responseText // get the JSON string
    let object = JSON.parse(responseStr) // turn it into an object
    showTranlsate(object)
    if (key == 1) {
      makeStoreReq(object.english, object.translated)
    }
  }

  xhr.onerror = function () {
    alert('Woops, there was an error making the request.')
  }
  // Actually send request to server
  xhr.send()
}

// Make the actual CORS request.
function makeStoreReq (word, translation) {
  let url = `store?english=${word}&korean=${translation}`
  let xhr = createRequest('GET', url)

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported')
    return
  }

  // Load some functions into response handlers.
  xhr.onload = function () {
    let responseStr = xhr.responseText // get the JSON string
    let object = JSON.parse(responseStr) // turn it into an object
    // console.log(object);
  }

  xhr.onerror = function () {
    alert('Woops, there was an error making the request.')
  }
  // Actually send request to server
  xhr.send()
}

function dumpDatabase () {
  let url = `dump?`
  let xhr = createRequest('GET', url)

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported')
    return
  }

  // Load some functions into response handlers.
  xhr.onload = function () {
    let responseStr = xhr.responseText // get the JSON string
    let object = JSON.parse(responseStr) // turn it into an object
    // console.log(object);
  }

  xhr.onerror = function () {
    alert('Woops, there was an error making the request.')
  }
  // Actually send request to server
  xhr.send()
}
