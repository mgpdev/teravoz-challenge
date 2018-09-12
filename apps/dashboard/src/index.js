import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const wrapper = document.getElementById("react-wrapper")

wrapper ? ReactDOM.render(<App />, wrapper) : false