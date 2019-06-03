import React from 'react'
import './css/Card.css'

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
    console.log('inside card prop', checkAnswer)
    const { frontContent, backContent, flipped } = this.state
    return (
      <div
        onClick={this.flip}
        className={
          'card-container' +
          (flipped ? ' flipped' : '') +
          (checkAnswer ? ' check-answer' : '')
        }
      >
        {checkAnswer ? (
          result
        ) : (
          <div>
            <Front text={frontContent} />
            <Back text={backContent} />
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
