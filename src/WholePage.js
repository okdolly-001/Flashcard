import React, { Component } from 'react'
import AddCard from './addCard.js'
import ReviewCard from './reviewCard.js'
import Header from './Header.js'
import './css/Lango.css'

class WholePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onCreatePage: true,
      username: 'Username'
    }
  }
  switchPage = () => {
    this.setState(prevState => ({
      onCreatePage: !prevState.onCreatePage
    }))
  }

  render () {
    return (
      <div className='App'>
        <Header
          clickHandler={this.switchPage.bind(this)}
          text={this.state.onCreatePage ? 'Start Review' : 'Add'}
        />
        {this.state.onCreatePage ? <AddCard /> : <ReviewCard />}
        <footer>
          <p className='footer-text'>{this.state.username}</p>
        </footer>
      </div>
    )
  }
}

export default WholePage
