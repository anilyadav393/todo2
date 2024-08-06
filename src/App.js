import React, { useState, useEffect } from 'react';
import './App.css';
import { FaMoon, FaSun, FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (editIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex].text = newTodo;
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([...todos, { text: newTodo, complete: false }]);
    }
    setNewTodo('');
    setShowForm(false);
  };

  const handleToggleComplete = index => {
    const updatedTodos = [...todos];
    updatedTodos[index].complete = !updatedTodos[index].complete;
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = index => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleEditTodo = index => {
    setNewTodo(todos[index].text);
    setEditIndex(index);
    setShowForm(true);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    if (filter === 'Complete') return todo.complete;
    if (filter === 'Incomplete') return !todo.complete;
    return true;
  });

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1 className="title">TODO LIST</h1>
      <div className="controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes ..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="dropdown">
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
        </select>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="toggle-button">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      {!showForm && (
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-text">Empty...</p>
          ) : (
            filteredTodos.map((todo, index) => (
              <li key={index} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => handleToggleComplete(index)}
                />
                <span
                  className={todo.complete ? 'completed' : ''}
                  onClick={() => handleToggleComplete(index)}
                >
                  {todo.text}
                </span>
                <div className="todo-buttons">
                  <button onClick={() => handleEditTodo(index)} className="edit-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteTodo(index)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <button onClick={() => setShowForm(true)} className="add-note-button">
        <FaPlus />
      </button>

      {showForm && (
        <div className="form-card">
          <h2>{editIndex !== null ? 'Edit Note' : 'Add New Todo'}</h2>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter your note"
            className="form-input"
          />
          <div className="form-buttons">
            <button onClick={handleAddTodo} className="apply-button">Apply</button>
            <button onClick={() => { setShowForm(false); setNewTodo(''); }} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
