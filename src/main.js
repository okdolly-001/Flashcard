import React from 'react'
import ReactDOM from 'react-dom'
import AddCard from './addCard'

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    React.createElement(AddCard),
    document.getElementById('mount')
  )
})
