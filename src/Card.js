import React from 'react'
import './css/Card.css'

class Card extends React.Component {
  constructor() {
    super()
    this.state = {
      showAnswer: false
    }
  }

  render() {
    const content = this.state.showAnswer
      ? this.props.backContent
      : this.props.frontContent

    const cardClass = this.state.showAnswer
      ? 'back'
      : ''
    const contentClass = this.state.showAnswer
      ? 'back'
      : 'front'
    const actionClass = this.state.showAnswer
      ? 'active'
      : ''

    return (
      <div
        className={`card ${cardClass}`}
        onClick={() => this.setState({
        showAnswer: !this.state.showAnswer
      })}>
        <span className='card__counter'>{this.props.cardNumber + 1}</span>
        <div
          className='card__flip-card'
          onClick={() => {
          this.setState({
            showAnswer: !this.state.showAnswer
          })
        }}>
          <span className={`fa fa-${iconClass}`}/>
        </div>
        <div className={`card__content--${contentClass}`}>{content}</div>
        <div className={`card__actions ${actionClass}`}>
          <div
            className='card__prev-button'
            onClick={() => {
            this
              .props
              .showPrevCard()this
              .setState({showAnswer: false})
          }}>
            Prev
          </div>
          <div
            className='card__next-button'
            onClick={() => {
            this
              .props
              .showNextCard()this
              .setState({showAnswer: false})
          }}>
            Next
          </div>
        </div>
      </div>
    )
  }
}
