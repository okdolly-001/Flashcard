import React from 'react'
import './css/Lango.css'
import './css/ReviewPage.css'
import BottomButton from './BottomButton.js'
import Card from './Card.js'
class ReviewCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [],
      currentCard: {}
    }
  }
  componentDidMount () {
    this.makeRequest('dump', 'GET', this.loadCards)
  }
  handleChange = e => {
    this.setState({ english_text: e.target.value })
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

  makeRequest = (url, action, callbackFunction) => {
    let xhr = this.createRequest(action, url)
    if (!xhr) {
      alert('CORS not supported')
      return
    }
    if (action === 'GET') {
      xhr.onload = function () {
        let responseStr = xhr.responseText
        let object = JSON.parse(responseStr)
        if (callbackFunction) {
          callbackFunction(object)
        }
      }
    }
    xhr.onerror = function () {
      alert('Woops, there was an error making the request.')
    }
    xhr.send()
  }

  loadCards = json => {
    const preload = this.state.cards
    preload.push(...json.data)
    if (preload.length != 0) {
      this.setState({
        cards: preload,
        currentCard: this.getRandomCard(preload)
      })
    }
  }

  hideError = () => {
    this.setState({ showError: false })
  }

  getRandomCard = preload => {
    let randomIndex = Math.floor(Math.random() * preload.length)
    let card = preload[randomIndex]
    if (Object.keys(this.state.currentCard).length === 0) {
      console.log(this.state.currentCard)
      this.incrementSeen(card)
      return card
    }
    if (card.id === this.state.currentCard.id) {
      return this.getRandomCard(preload)
    }
    console.log('correct and seen ' + card.correct / 2 + ' ' + card.seen)

    let score =
      Math.max(1, 5 - Number(card.correct)) +
      Math.max(1, 5 - Number(card.seen)) +
      (6 * (Number(card.seen) - Number(card.correct))) / (Number(card.seen) + 1)

    let threshold = Math.floor(Math.random() * 15)
    console.log('threshhold id ' + threshold + ' score is: ' + score)
    if (Number(card.seen) === 0 || threshold <= score) {
      console.log(card)
      this.incrementSeen(card)
      return card
    } else {
      return this.getRandomCard(preload)
    }
  }

  incrementSeen = card => {
    this.makeRequest(`seen/${card.id}`, 'POST', null)
  }

  incrementCorrect = card => {
    this.makeRequest(`correct/${card.id}`, 'POST', null)
  }

  getNextCard = () => {
    this.setState({ currentCard: this.getRandomCard(this.state.cards) })
  }

  render () {
    const errorMessage = this.state.showError
      ? 'Please fill in a phrase and hit Enter key'
      : ''
    if (Object.keys(this.state.currentCard).length == 0) {
      return <div>Loading...</div>
    }
    return (
      <div className='App'>
        <Card
          key={this.state.currentCard}
          question={this.state.currentCard.chinese}
          answer={this.state.currentCard.english}
          correctHandler={this.incrementCorrect}
        />
        <BottomButton clickHandler={this.getNextCard.bind(this)} text='Next' />
        <div className='create-card__error'>{errorMessage}</div>
      </div>
    )
  }
}

export default ReviewCard
