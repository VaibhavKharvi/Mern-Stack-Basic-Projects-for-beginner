import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Read all todos and sort by createdAt (oldest first)
  useEffect(() => {
    axios.get(API)
      .then(res => {
        // Sort by createdAt ascending (oldest first)
        const sorted = [...res.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setTodos(sorted);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // Create – add new todo to the END of the list
  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(API, { text });
      // New todo goes to bottom (append)
      setTodos([...todos, res.data]);
      setText('');
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  // Toggle completed
  const toggleComplete = async (id) => {
    try {
      const res = await axios.put(`${API}/${id}/toggle`);
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Delete
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  // Save edited text
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${API}/${id}`, { text: editText });
      setTodos(todos.map(t => t._id === id ? res.data : t));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Edit save error:', err);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1>✨ My Tasks</h1>
        <div className="input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a task..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo}>+ Add</button>
        </div>

        <ul className="todo-list">
          {todos.length === 0 && <li className="empty">No tasks. Enjoy your day! 🎉</li>}
          {todos.map(todo => (
            <li key={todo._id} className={todo.completed ? 'completed' : ''}>
              {editingId === todo._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(todo._id)}>💾 Save</button>
                  <button onClick={() => setEditingId(null)}>✖ Cancel</button>
                </div>
              ) : (
                <>
                  <span onClick={() => toggleComplete(todo._id)}>
                    {todo.completed ? '✅' : '◻️'} {todo.text}
                  </span>
                  <div className="actions">
                    <button onClick={() => startEdit(todo)}>✏️</button>
                    <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;