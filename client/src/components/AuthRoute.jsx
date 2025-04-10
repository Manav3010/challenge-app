import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { getAccessToken, setAccessToken } from '../api/axios';
import Auth from '../pages/Auth';

const AuthRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (getAccessToken()) {
        navigate('/tasks', { replace: true });
        return;
      }

      try {
        const res = await axios.post('/refresh', {}, { withCredentials: true });
        if (res.data.token) {
          setAccessToken(res.data.token);
          navigate('/tasks', { replace: true });
        }
      } catch (err) {
        // No refresh token or expired — stay on Auth
      }
    };

    checkAuth();
  }, [navigate]);

  return <Auth />;
};

export default AuthRoute;
