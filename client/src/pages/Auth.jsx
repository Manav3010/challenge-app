import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Todo.css'; // Reuse styles

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setUsername('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (isSignup && !username)) {
      return alert('All fields are required');
    }
    if (password.length < 6) {
      return alert('Password must be at least 6 characters');
    }

    try {
      if (isSignup) {
        await axios.post('/register', { username, email, password });
        alert('Signup successful! You can now login.');
        setIsSignup(false);
      } else {
        const res = await axios.post('/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/tasks');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-container">
        <h1 className="todo-title">{isSignup ? 'Sign Up' : 'Login'}</h1>

        <form onSubmit={handleSubmit} className="todo-form flex-column align-items-stretch">
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              className="todo-input mb-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="todo-input mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="todo-input mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={`toggle-eye ${showPassword ? 'active' : ''}`}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          </div>

          <button type="submit" className="todo-btn w-100 mt-2">
            {isSignup ? '✍️ Sign Up' : '🔓 Login'}
          </button>
        </form>

        <p className="mt-3 text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-primary"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={toggleMode}
          >
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
