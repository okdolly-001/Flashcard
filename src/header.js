import React from 'react'
import './css/Lango.css'

const Header = props => (
  <div className='header'>
    <button className='btn-primary btn-lg'
     id='header-button'>
      {props.action}
    </button>
    <p className='lango-header'>Lango!</p>
  </div>
)

export default Header
