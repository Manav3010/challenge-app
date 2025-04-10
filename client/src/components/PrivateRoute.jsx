import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { getAccessToken, setAccessToken } from '../api/axios';
import Tasks from '../pages/Todo';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (getAccessToken()) {
        setTokenExists(true);
        setChecking(false);
        return;
      }

      try {
        const res = await axios.post('/refresh', {}, { withCredentials: true });
        if (res.data.token) {
          setAccessToken(res.data.token);
          setTokenExists(true);
        } else {
          navigate('/', { replace: true });
        }
      } catch {
        navigate('/', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [navigate]);

  if (checking) return <p>Loading...</p>;

  return tokenExists ? <Tasks /> : null;
};

export default PrivateRoute;
