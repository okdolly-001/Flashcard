import React from 'react'
import './css/BottomButton.css'

const BottomButton = props => (
  <div className='bottom-row'>
    <button
      id='bottom-button'
      className='btn-primary'
      onClick={() => {
        props.clickHandler()
      }}
    >
      {props.text}
    </button>
  </div>
)

export default BottomButton
