import React, { Component } from 'react'
import AddCard from './AddPage'
import ReviewCard from './ReviewPage'
import Header from './Header'
import './css/Lango.css'
import './css/Footer.css'

class WholePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onCreatePage: true,
      username: 'Username',
      google_id: ''
    }
  }
  componentDidMount () {
    this.makeRequest()
  }
  switchPage = () => {
    this.setState(prevState => ({
      onCreatePage: !prevState.onCreatePage
    }))
  }
  createRequest = (method, url) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    return xhr
  }

  makeRequest = () => {
    let url = `get_user`
    let xhr = this.createRequest('GET', url)
    let callbackFunction = this.setUsername
    if (!xhr) {
      alert('CORS not supported')
      return
    }
    xhr.onload = function () {
      let responseStr = xhr.responseText
      let object = JSON.parse(responseStr)
      callbackFunction(object)
    }
    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }
    xhr.send()
  }

  setUsername = json => {
    this.setState({ username: json.name, google_id: json.google_id })
  }

  render () {
    return (
      <main>
        <div className='App'>
          <Header
            clickHandler={this.switchPage.bind(this)}
            text={this.state.onCreatePage ? 'Start Review' : 'Add'}
          />
          {this.state.onCreatePage ? (
            <AddCard google_id={this.state.google_id} />
          ) : (
            <ReviewCard google_id={this.state.google_id} />
          )}
        </div>
        <footer>
          <p className='footer-text'>{this.state.username}</p>
        </footer>
      </main>
    )
  }
}

export default WholePage
