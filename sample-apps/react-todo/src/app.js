import React, { useState, useEffect } from 'react'

import './app.css'

export default function App(db) {
  const [todoText, setTodoText] = useState('')
  const [todoList, setTodoList] = useState([])
  const addTodo = text => {
    setTodoList([...todoList, text])
  }
  return (
    <div>
      <form>
        <label>Todo</label>
        <input
          type="text"
          name="todo"
          onChange={e => setTodoText(e.target.value)}
          value={todoText}
        />
      </form>
      <button onClick={() => addTodo(todoText)}>Add Todo</button>
      <ul>
        {todoList.map(k => (
          <li key={k}>{k}</li>
        ))}
      </ul>
    </div>
  )
}
