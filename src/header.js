import React from 'react'
import './css/Lango.css'

const Header = props => (
  <div className='header'>
    <button
      className='btn-primary btn-lg'
      id='header-button'
      onClick={() => {
        props.clickHandler()
      }}
    >
      {props.text}
    </button>
    <p className='lango-header'>Lango!</p>
  </div>
)

export default Header
