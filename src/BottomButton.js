import React from 'react'
import './css/Lango.css'

const BottomButton = props => (
  <div className='bottom-row'>
    <button
      id='bottom-button'
      className='btn-primary btn-lg'
      onClick={() => {
        props.clickHandler()
      }}
    >
      {props.text}
    </button>
  </div>
)

export default BottomButton
