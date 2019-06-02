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
      currentCard: {},
      userInput: '',
      checkAnswer: false,
      isCorrect: false
    }
  }
  componentDidMount () {
    this.makeRequest('dump', 'GET', this.loadCards)
  }

  validate = e => {
    const eventKey = e.key
    if (eventKey === 'Enter') {
      this.setState({ userInput: this.state.userInput.trim() }, () => {
        console.log('user input ' + this.state.userInput)

        if (this.state.userInput.length > 0 && eventKey === 'Enter') {
          if (this.state.userInput == this.state.currentCard.english) {
            console.log('correct!')

            this.setState({ checkAnswer: true, isCorrect: true })
            this.incrementCorrect(this.state.currentCard.id)
          } else {
            console.log('answer is:' + this.state.currentCard.english)
            console.log('user input:' + this.state.userInput)
            this.setState({ checkAnswer: true, isCorrect: false })
          }
        }
      })
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

  getRandomCard = preload => {
    let randomIndex = Math.floor(Math.random() * preload.length)
    let card = preload[randomIndex]
    if (Object.keys(this.state.currentCard).length === 0) {
      console.log(this.state.currentCard)
      this.incrementSeen(card.id)
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
      this.incrementSeen(card.id)
      return card
    } else {
      return this.getRandomCard(preload)
    }
  }

  incrementSeen = id => {
    this.makeRequest(`seen/${id}`, 'POST', null)
  }

  incrementCorrect = id => {
    this.makeRequest(`correct/${id}`, 'POST', null)
  }

  getNextCard = () => {
    this.setState({
      currentCard: this.getRandomCard(this.state.cards),
      userInput: '',
      checkAnswer: false,
      isCorrect: false
    })
  }
  flipHandler = () => {
    this.setState({
      checkAnswer: false,
      isCorrect: false
    })
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
            key={this.state.currentCard}
            question={this.state.currentCard.chinese}
            checkAnswer={this.state.checkAnswer}
            answer={this.state.currentCard.english}
            isCorrect={this.state.isCorrect}
            flipHandler={this.flipHandler.bind(this)}
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
