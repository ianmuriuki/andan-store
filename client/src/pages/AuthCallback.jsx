import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    if (token) {
      Cookies.set('token', token, { expires: 7 });
      if (refresh) Cookies.set('refreshToken', refresh, { expires: 30 });
      fetchUser().then(() => navigate('/'));
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, fetchUser]);

  return <div>Completing authentication...</div>;
};

export default AuthCallback;
