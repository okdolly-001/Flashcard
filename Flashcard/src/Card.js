import React from 'react'
import './css/Card.css'
import FlipSvg from './FlipSvg'

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      flipped: false,
      frontContent: this.props.question,
      backContent: this.props.answer
    }
  }

  flip = () => {
    this.props.flipHandler()
    this.setState(prevState => ({
      flipped: !prevState.flipped
    }))
  }

  render () {
    const result = this.props.isCorrect ? <CorrectCard /> : <WrongtCard />
    const { checkAnswer } = this.props
    return (
      <div
        onClick={this.flip}
        className={
          'card-container' +
          (this.state.flipped ? ' flipped' : '') +
          (checkAnswer ? ' check-answer' : '')
        }
      >

        {checkAnswer ? (
          result
        ) : (
          <div>
            <Front text={this.state.frontContent} />
            <Back text={this.state.backContent} />
          </div>
        )}
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
