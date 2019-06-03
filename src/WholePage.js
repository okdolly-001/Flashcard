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
      onCreatePage: false,
      username: 'Username',
      noCard: true
    }
  }
  componentDidMount () {
    this.makeRequest('dump', 'GET', this.loadCards)
    this.makeRequest('get_user', 'GET', this.setUsername)
  }
  loadCards = json => {
    if (json.data.length != 0) {
      this.setState({ noCard: false })
    }
  }

  switchPage = () => {
    this.makeRequest('dump', 'GET', this.loadCards)
    this.setState(prevState => ({
      onCreatePage: !prevState.onCreatePage
    }))
  }

  createRequest = (method, url) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    return xhr
  }

  makeRequest = (url, action, callbackFunction) => {
    let xhr = this.createRequest(action, url)
    if (!xhr) {
      alert('CORS not supported')
      return
    }
    xhr.onload = function () {
      let responseStr = xhr.responseText
      if (responseStr && callbackFunction) {
        console.log(responseStr)
        let object = JSON.parse(responseStr)
        callbackFunction(object)
      }
    }
    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }
    xhr.send()
  }

  setUsername = json => {
    this.setState({ username: json.name })
  }

  render () {
    let page = null
    if (this.state.noCard) {
      page = <AddCard />
    }

    console.log('noCard ', this.state.noCard, this.state.onCreatePage)
    return (
      <main>
        <div className='App'>
          <Header
            clickHandler={this.switchPage.bind(this)}
            text={page || this.state.onCreatePage ? 'Start Review' : 'Add'}
          />
          {page || this.state.onCreatePage ? <AddCard /> : <ReviewCard  clickHandler={this.switchPage.bind(this)}/>}
        </div>
        <footer>
          <p className='footer-text'>{this.state.username}</p>
        </footer>
      </main>
    )
  }
}

export default WholePage
