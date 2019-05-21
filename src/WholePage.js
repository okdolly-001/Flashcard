import React, { Component } from 'react'
import AddCard from './AddPage.js'
import ReviewCard from './ReviewPage.js'
import Header from './Header.js'
import './css/Lango.css'
import './css/Footer.css'

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
      <main>
        <div className='App'>
          <Header
            clickHandler={this.switchPage.bind(this)}
            text={this.state.onCreatePage ? 'Start Review' : 'Add'}
          />
          {this.state.onCreatePage ? <AddCard /> : <ReviewCard />}
        </div>
        <footer>
          <p className='footer-text'>{this.state.username}</p>
        </footer>
      </main>
    )
  }
}

export default WholePage
