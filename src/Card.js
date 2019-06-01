import React from 'react'
import './css/Card.css'
import FlipSvg from './FlipSvg.js'
import CorrectCard from './CorrectCard.js'
class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userInput: '',
      showAnswer: false,
      isCorrect: false
    }
  }

  showUserInput = e => {
    this.setState({ userInput: e.target.value })
  }

  flip = () => {
    this.setState({ showAnswer: !this.state.showAnswer, isCorrect: false })
  }
  validate = e => {
    if (this.state.userInput.length > 0 && e.key === 'Enter') {
      if (this.state.userInput == this.state.answer) {
        this.setState({ isCorrect: true })
        this.props.correctHandler(props.card)
      } else {
        // TO-DO
        displayWrong()
      }
    }
  }

  render () {
    const content = this.state.showAnswer
      ? this.props.answer
      : this.props.question
    console.log('content', content)
    return (
      <div className='container'>
        <div className='card'>
          {this.state.isCorrect ? <CorrectCard /> : content}
          <FlipSvg className='flip-svg' onClick={this.flip} />
        </div>
        <textarea
          className='textarea-card'
          onChange={this.showUserInput}
          value={this.state.userInput}
          onKeyDown={this.validate}
        />
      </div>
    )
  }
}

export default Card
