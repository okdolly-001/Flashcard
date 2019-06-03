import React from 'react'
import './css/Header.css'

const Header =({text, clickHandler}) => (

  <div className='header'>
    <a
      className='btn-primary btn-lg'
      id='header-button'
      onClick={() => {
        clickHandler()
      }}
    >
      <p> {text}</p>
    </a>
    <p className='lango-header'>Lango!</p>
    <a href='/logout' className='btn-primary btn-lg' id='log-out-button'>
      {' '}
      <p>Log out</p>{' '}
    </a>
  </div>
)

export default Header
