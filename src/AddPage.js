import React from 'react'
import './css/AddPage.css'
import './css/Lango.css'
import BottomButton from './BottomButton.js'

class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      english_text: 'English',
      translation: 'Translation',
      showError: false,
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
    }, 500)
  }

  restart = () => {
    if (
      this.state.english_text.length === 0 &&
      this.state.translation.length === 0
    ) {
      this.reset()
    }
  }

  startTyping = () => {
    this.setState({ english_text: '', translation: '', didUserType: true })
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
    let xhr = this.createRequest('GET', url)
    let callbackFunction =
      requestType === 'GET' ? this.showTranslation : this.reset
    if (!xhr) {
      alert('CORS not supported')
      return
    }

    xhr.onload = function () {
      let responseStr = xhr.responseText
      console.log(responseStr)
      let object = JSON.parse(responseStr)
      callbackFunction(object)
    }
    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }
    xhr.send()
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

  storeTranslation = () => {
    if (
      this.state.english_text.length === 0 ||
      this.state.translation.length === 0 ||
      !this.state.didUserType
    ) {
      this.setState({ showError: true })
      setTimeout(() => this.hideError(), 1000)
    } else {
      this.makeRequest('STORE')
    }
  }

  hideError = () => {
    this.setState({ showError: false })
  }

  render () {
    const errorMessage = this.state.showError
      ? 'Please fill in a phrase and hit Enter key'
      : ''
    const textColor = this.state.didUserType ? 'black' : 'grey'
    return (
      <div className='App'>
        <div className='cards-in-row'>
          <textarea
            style={{
              color: textColor
            }}
            autoFocus
            className='textarea-card'
            value={this.state.english_text}
            onChange={this.handleChange}
            onMouseDown={this.startTyping}
            onKeyDown={this.translate}
            onMouseLeave={this.restart}
          />
          <textarea
            style={{
              color: textColor
            }}
            className='textarea-card'
            value={this.state.translation}
            onChange={this.showTranslation}
          />
        </div>
        <BottomButton
          clickHandler={this.storeTranslation.bind(this)}
          text='Save'
        />
        <div className='create-card__error'>{errorMessage}</div>
      </div>
    )
  }
}

export default AddCard
