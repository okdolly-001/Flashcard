import React from 'react'
import './css/Card.css'

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      flipped: false,
      userInput: '',
      checkAnswer: false,
      isCorrect: false
    }
    this.flip = this.flip.bind(this)
  }
  showUserInput = e => {
    this.setState({ userInput: e.target.value })
  }

  flip = () => {
    this.setState({
      flipped: !this.state.flipped,
      checkAnswer: false
    })
  }
  validate = e => {
    const eventKey = e.key
    console.log(eventKey)
    if (eventKey === 'Enter') {
      this.setState({ userInput: this.state.userInput.trim() }, () => {
        console.log('user input ' + this.state.userInput)
        if (this.state.userInput.length > 0 && eventKey === 'Enter') {
          if (this.state.userInput == this.props.answer) {
            this.setState({ checkAnswer: true, isCorrect: true })
            this.props.correctHandler(this.props.id)
          } else {
            console.log('answer is:' + this.props.answer)
            console.log('user input:' + this.state.userInput)
            this.setState({ checkAnswer: true, isCorrect: false })
          }
        }
      })
    }
  }

  render () {
    return (
      <div className='card'>
        <div
          onClick={this.flip}
          className={'card-container' + (this.state.flipped ? ' flipped' : '')}
        >
       {/* {this.state.isCorrect&&this.state.checkAnswer ? <CorrectCard /> : content}  */}
          <Front text={this.props.question} />
          <Back text={this.props.answer} />
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

const Front = props => <div className='front'>{props.text}</div>

const Back = props => <div className='back'>{props.text}</div>

const CorrectCard = () => (
  <div className='correct-card'>
    <p className='correct'>CORRECT!</p>
  </div>
)
const WrongtCard = () => (
  <div className='wrong-card'>
    <p className='wrong'>WRONG!</p>
  </div>
)

export default Card
