import React from 'react'
import './css/Lango.css'

class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      english_text: 'English',
      translation: 'Translation'
    }
  }

  handleChange = e => {
    this.setState({ english_text: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    console.log(`English: ${this.state.english_text}`)
    this.setState({ english_text: 'English', translation: 'Translation' })
  }

  showTranslate = json => {
    this.setState({ translation: json.translated })
  }

  createRequest = (method, url) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true) // call its open method
    return xhr
  }

  makeRequest = item => {
    let url = `translate?english=${item}`
    let xhr = this.createRequest('GET', url)
    let translateFunction = this.showTranslate
    if (!xhr) {
      alert('CORS not supported')
      return
    }

    xhr.onload = function () {
      let responseStr = xhr.responseText
      console.log(responseStr)
      let object = JSON.parse(responseStr)
      translateFunction(object)
      // showTranlsate(object)
    }

    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }

    xhr.send()
  }

  checkReturn = e => {
    console.log('key is :', e.key)
    if (e.key === 'Enter') {
      console.log('make request')

      let item = this.state.english_text
      console.log(item)
      this.makeRequest(item)
    }
  }

  render () {
    return (
      <div>
        <textarea
          id='english-card'
          value={this.state.english_text}
          onChange={this.handleChange}
          onKeyPress={this.checkReturn}
        />
        <textarea
          id='translated-card'
          value={this.state.translation}
          onChange={this.showTranslate}
        />

        <button type='submit' id='landing-button' />
      </div>
    )
  }
}

export default AddCard
