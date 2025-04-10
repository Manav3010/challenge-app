import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/AuthRoute';
import Tasks from './pages/Todo';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public: AuthRoute wraps just "/" */}
        <Route path="/" element={<AuthRoute />} />

        {/* Protected: PrivateRoute wraps "/tasks" */}
        <Route path="/tasks" element={<PrivateRoute />} />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
