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
  componentDidMount() {
    this.makeRequest()
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

  makeRequest = () => {
    let url = `dump`
    let xhr = this.createRequest('GET', url)
    let callbackFunction = this.loadCards
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

  // [ { user: 1,
  //   english: 'exampl_phrase',
  //   korean: '예시문구',
  //   seen: 0,
  //   correct: 0 },
  loadCards = json => {
    const currentCards = this.state.cards
    console.log('json is', json)
    currentCards.push(...json.data)
    this.setState({
      cards: currentCards,
      currentCard: this.getRandomCard(currentCards)
    })
    console.log('currentCard', this.state.currentCard)
  }

  hideError = () => {
    this.setState({ showError: false })
  }

  getRandomCard = currentCards => {
    let randomIndex = Math.floor(Math.random() * currentCards.length)
    let card = currentCards[randomIndex]
    if (card === this.currentCard) {
      this.getRandomCard(currentCards)
    }
    console.log(card)
    return card
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
        <Card card={this.state.currentCard} />
        <BottomButton text='Next' />
        <div className='create-card__error'>{errorMessage}</div>
      </div>
    )
  }
}

export default ReviewCard
