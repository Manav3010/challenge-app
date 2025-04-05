import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Todo from './pages/Todo';
import PrivateRoute from './components/PrivateRoute';
import axios from './api/axios';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        try {
          const res = await axios.post('/refresh');
          localStorage.setItem('token', res.data.token);
        } catch (err) {
          console.log('🔁 Auto-login failed:', err?.response?.data?.msg || err.message);
          localStorage.clear();
        }
      }

      setLoading(false); // ✅ Only allow app to render after refresh attempt
    };

    tryRefresh();
  }, []);

  if (loading) return <div>Loading...</div>; // 🔄 optional spinner placeholder

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Todo />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
