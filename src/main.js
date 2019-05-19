import React from 'react'
import ReactDOM from 'react-dom'
import WholePage from './WholePage'

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    React.createElement(WholePage),
    document.getElementById('mount')
  )
})
