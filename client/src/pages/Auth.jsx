import React, { useState } from 'react';
import axios, { setAccessToken } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Todo.css';

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setUsername('');
    setPhone('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignup && (!username || !phone))) {
      return alert('All fields are required');
    }

    try {
      if (isSignup) {
        await axios.post('/register', { username, email, password, phone });
        alert('Signup successful!');
        setIsSignup(false);
      } else {
        const res = await axios.post('/login', { email, password });
        setAccessToken(res.data.token);
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
            <>
              <input
                type="text"
                placeholder="Username"
                className="todo-input mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="todo-input mb-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
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
            >
              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          </div>
          <button type="submit" className="todo-btn w-100 mt-2">
            {isSignup ? 'Sign Up' : 'Login'}
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
