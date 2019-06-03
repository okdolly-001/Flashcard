import React from 'react'
import './css/Lango.css'
import BottomButton from './BottomButton.js'
import Card from './Card.js'
class ReviewCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [],
      currentCard: {},
      userInput: '',
      isCorrect: false,
      keyID: 0,
      flipped: false
    }
  }
  componentDidMount () {
    this.makeRequest('dump', 'GET', this.loadCards)
  }

  loadCards = json => {
    const preload = this.state.cards
    preload.push(...json.data)
    console.log('cards ', preload)
    if (preload.length != 0) {
      this.setState(
        prevState => {
          return {
            cards: preload,
            currentCard: this.getRandomCard(preload),
            userInput: '',
            isCorrect: false,
            keyID: prevState.keyID + 1,
            flipped: false
          }
        },
        () => {
          console.log(this.state.currentCard)
        }
      )
    }
  }

  validate = e => {
    const eventKey = e.key
    if (eventKey === 'Enter') {
      this.setState(
        prevState => ({ userInput: prevState.userInput.trim() }),
        () => {
          if (eventKey === 'Enter') {
            if (this.state.userInput == this.state.currentCard.english) {
              this.setState({ isCorrect: true })
              this.incrementCorrect(this.state.currentCard)
            } else {
              this.flipHandler()
            }
          }
        }
      )
    }
  }

  showUserInput = e => {
    this.setState({ userInput: e.target.value })
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

  getRandomCard = preload => {
    let randomIndex = Math.floor(Math.random() * preload.length)
    let card = preload[randomIndex]
    console.log('currentCard', this.state.currentCard)
    if (Object.keys(this.state.currentCard).length === 0) {
      this.incrementSeen(card)
      return card
    }
    if (card.id === this.state.currentCard.id) {
      return this.getRandomCard(preload)
    }

    let score =
      Math.max(1, 5 - Number(card.correct)) +
      Math.max(1, 5 - Number(card.seen)) +
      (6 * (Number(card.seen) - Number(card.correct))) / (Number(card.seen) + 1)
    let threshold = Math.floor(Math.random() * 16)
    console.log('threshhold id ' + threshold + ' score is: ' + score)
    if (Number(card.seen) === 0 || threshold <= score) {
      this.incrementSeen(card)
      return card
    } else {
      return this.getRandomCard(preload)
    }
  }

  incrementSeen = card => {
    this.makeRequest(`seen/${card.id}`, 'GET', null)
  }

  incrementCorrect = card => {
    this.makeRequest(`correct/${card.id}`, 'GET', null)
  }

  getNextCard = () => {
    console.log('next pressed')
    this.makeRequest('dump', 'GET', this.loadCards)
  }

  flipHandler = () => {
    this.setState(prevState => ({
      flipped: !prevState.flipped,
      isCorrect: false
    }))
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
        <div className='card'>
          <Card
            key={this.state.keyID}
            question={this.state.currentCard.chinese}
            answer={this.state.currentCard.english}
            isCorrect={this.state.isCorrect}
            flipHandler={this.flipHandler.bind(this)}
            flipped={this.state.flipped}
          />
          <textarea
            className='textarea-card'
            onChange={this.showUserInput}
            value={this.state.userInput}
            onKeyDown={this.validate}
          />
        </div>
        <BottomButton clickHandler={this.getNextCard.bind(this)} text='Next' />
        <div className='create-card__error'>{errorMessage}</div>
      </div>
    )
  }
}

export default ReviewCard
