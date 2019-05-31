import React from 'react'
import './css/Header.css'

const Header = props => (
  <div className='header'>
    <a
      className='btn-primary btn-lg'
      id='header-button'
      onClick={() => {
        props.clickHandler()
      }}
    >
      {props.text}
    </a>
    <p className='lango-header'>Lango!</p>
    <a href="/logout" className = 'btn-primary btn-lg'
 id="log-out-button">Log out</a>
  </div>
)

export default Header
