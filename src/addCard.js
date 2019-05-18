import React from 'react'
import './css/Lango.css'
import Header from './header.js'

class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      english_text: 'English',
      translation: 'Translation',
      showError: false,
      action: 'Start Review',
      didUserType: false
    }
  }

  handleChange = e => {
    this.setState({ english_text: e.target.value })
  }

  reset = () => {
    setTimeout(() => {
      this.setState({
        english_text: 'English',
        translation: 'Translation',
        didUserType: false
      })
    }, 2000)
  }
  startTyping = e => {
    this.setState({
      english_text: '',
      translation: '',
      didUserType: true
    })
  }

  createRequest = (method, url) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    return xhr
  }

  makeRequest = requestType => {
    let url =
      requestType === 'GET'
        ? `translate?english=${this.state.english_text}`
        : `store?english=${this.state.english_text}&korean=${
          this.state.translation
        }`
    let xhr = this.createRequest(requestType, url)

    let callbackFunction =
      requestType === 'GET' ? this.showTranslation : this.reset
    if (!xhr) {
      alert('CORS not supported')
      return
    }
    if (requestType === 'GET') {
      xhr.onload = function () {
        let responseStr = xhr.responseText
        console.log(responseStr)
        let object = JSON.parse(responseStr)
        callbackFunction(object)
      }
    }
    if (requestType === 'POST') {
      xhr.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          callbackFunction()
        }
      }
    }
    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }

    xhr.send()
  }

  storeTranslation = () => {
    if (
      this.state.english_text.length === 0 ||
      this.state.translation.length === 0
    ) {
      this.setState({ showError: true })
      setTimeout(() => this.hideError(), 1000)
    } else {
      this.makeRequest('POST')
    }
  }

  translate = e => {
    if (!this.state.didUserType) {
      this.startTyping()
    }
    if (this.state.english_text.length !== 0 && e.key === 'Enter') {
      this.makeRequest('GET')
    }
  }

  showTranslation = json => {
    this.setState({ translation: json.translated })
  }

  hideError = () => {
    this.setState({ showError: false })
  }

  reStart = () => {
    if (
      this.state.english_text.length === 0 &&
      this.state.translation.length === 0
    ) {
      this.reset()
    }
  }

  render () {
    const errorMessage = this.state.showError
      ? 'Please fill in a phrase and hit Enter key'
      : ''
    const textColor = this.state.didUserType ? 'black' : 'grey'
    return (
      <div className='App'>
        <Header action={this.state.action} />

        <div className='cards-in-row'>
          <textarea
            style={{ color: textColor }}
            autoFocus
            className='textarea-card'
            value={this.state.english_text}
            onChange={this.handleChange}
            onMouseDown={this.startTyping}
            onKeyDown={this.translate}
            onMouseLeave={this.reStart}
          />
          <textarea
            style={{ color: textColor }}
            className='textarea-card'
            value={this.state.translation}
            onChange={this.showTranslation}
          />
        </div>

        <button
          type='submit'
          onClick={this.storeTranslation}
          id='landing-button'
        />
        <div className='create-card__error'>{errorMessage}</div>
      </div>
    )
  }
}

export default AddCard
