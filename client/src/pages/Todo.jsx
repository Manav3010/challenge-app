import React, { useEffect, useState } from 'react';
import axios, { clearAccessToken, markLoggingOut } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Todo.css';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      alert('Session expired. Please log in again.');
      localStorage.clear();
      navigate('/');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    try {
      const res = await axios.post('/tasks', { title, status: 'ongoing' });
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding task');
    }
  };

  const handleEditClick = (task) => {
    setIsEditing(true);
    setEditId(task._id);
    setTitle(task.title);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/tasks/${editId}`, { title });
      const updatedTasks = tasks.map((task) => task._id === editId ? res.data : task);
      setTasks(updatedTasks);
      setTitle('');
      setEditId(null);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || 'Error deleting task');
    }
  };

  const toggleStatus = async (task) => {
    const updatedStatus = task.status === 'completed' ? 'ongoing' : 'completed';
    try {
      const res = await axios.put(`/tasks/${task._id}`, {
        ...task,
        status: updatedStatus,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogout = async () => {
    markLoggingOut(); // prevent refresh retry loop
  
    try {
      await axios.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      clearAccessToken();
      navigate('/');
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="todo-wrapper">
      <div className="todo-container">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <h1 className="todo-title">todos</h1>

        <ul className="todo-list">
          {tasks.map((task) => (
            <li key={task._id} className="todo-item">
              <div style={{ flex: 1 }}>
                <span className="todo-text fw-bold">
                  {task.title}
                </span>
                {task.description && (
                  <p className="text-muted m-0">{task.description}</p>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <span
                  className={`status-icon ${task.status}`}
                  title="Click to toggle status"
                  onClick={() => toggleStatus(task)}
                >
                  {task.status === 'completed' ? '✅' : '⏳'}
                </span>
                <button className="edit-btn" onClick={() => handleEditClick(task)}>✏️</button>
                <button className="delete-btn" onClick={() => handleDelete(task._id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={isEditing ? handleUpdateTask : handleAddTask} className="todo-form">
          <input
            type="text"
            className="todo-input"
            placeholder="E.g. Build a web app"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="todo-btn">
            {isEditing ? '✏️' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Todo;
