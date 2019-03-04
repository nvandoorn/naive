import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import { dbFactory } from 'naive-client'
import * as serviceWorker from './serviceWorker'

const httpUrl = 'http://localhost:5000'
const wsUrl = 'ws://localhost:5001'
const db = dbFactory({ wsUrl, httpUrl })

db.init()

ReactDOM.render(<App db={db} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
