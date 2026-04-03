import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import api from '../services/api';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      api.get('/users/me')
        .then(response => {
          dispatch(setUser(response.data));
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);
};

export default useAuth;