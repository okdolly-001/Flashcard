import React from 'react'
import './css/Card.css'
import FlipSvg from './FlipSvg.js'
import CorrectCard from './CorrectCard.js'
class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      flipped: false ,
      question: props.card.korean,
      answer: props.card.english,
      userInput: '',
      showAnswer: false,
      isCorrect: false
    }
    this.flip = this.flip.bind(this);
  }
  showUserInput = e => {
    this.setState({ userInput: e.target.value })
  }

  flip = () => {
    this.setState({ flipped: !this.state.flipped, showAnswer: !this.state.showAnswer, isCorrect: false })
  }
  validate = e => {
    if (this.state.userInput.length > 0 && e.key === 'Enter') {
      if (this.state.userInput == this.state.answer) {
        this.setState({ isCorrect: true })
      } else {
        // TO-DO
        displayWrong()
      }
    }
  }

  render() {
    const content = this.state.showAnswer
    ? this.state.answer
    : this.state.question
    console.log('content', content)
    return (
      <div className="card">
      <div onClick={this.flip} className={"card-container" + (this.state.flipped ? " flipped" : "")}>
        {/* {this.state.isCorrect ? <CorrectCard /> : content} */}
        <Front text={this.state.question}/>
        <Back text={this.state.answer} />
      </div>
        <textarea className='textarea-card' onChange={this.showUserInput} value={this.state.userInput} onKeyDown={this.validate} />
      </div>
    )
  }
}

const Front = props => (
      <div className="front">
        {props.text} 
      </div>
)


const Back = props => (
  <div className="back">
    {props.text}
  </div>
)

// class Back extends React.Component {
//   render() {
//     return (
//       <div className="back">
//        {props.english}
//       </div>
//     )
//   }
// }
export default Card