import React from 'react'
import './css/Card.css'

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      flipped: false
    }
  }

  flip = () => {
    this.props.flipHandler()
    this.setState(prevState => ({
      flipped: !prevState.flipped
    }))
  }

  render () {
    if (this.props.checkAnswer) {
    }

    const result = this.props.isCorrect ? <CorrectCard /> : <WrongtCard />
    console.log('inside card prop', this.props.checkAnswer)
    return (
      <div
        onClick={this.flip}
        className={'card-container' + (this.state.flipped ? ' flipped' : '')}
      >
        {this.props.checkAnswer ? (
          result
        ) : (
          <div>
            <Front text={this.props.question} />
            <Back text={this.props.answer} />
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
