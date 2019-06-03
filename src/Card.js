import React from 'react'
import './css/Card.css'

const Card = ({ isCorrect, flipped, flipHandler, question, answer }) => (
  <div
    onClick={flipHandler}
    className={
      'card-container' +
      (flipped ? ' flipped' : '') +
      (isCorrect ? ' check-answer' : '')
    }
  >
    {isCorrect ? (
      <CorrectCard />
    ) : (
      <div>
        <Front text={question} />
        <Back text={answer} />
      </div>
    )}
  </div>
)

const Front = props => <div className='front'>{props.text}</div>

const Back = props => <div className='back'>{props.text}</div>

const CorrectCard = () => (
  <div className='correct-card'>
    <p className='correct'>CORRECT!</p>
  </div>
)

export default Card
