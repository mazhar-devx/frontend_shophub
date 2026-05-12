import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import api from '../services/api';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consentStr = localStorage.getItem('cookie-consent');
      if (consentStr) {
        try {
          const consent = JSON.parse(consentStr);
          // One Tap needs at least functional or marketing consent
          setHasConsent(consent.functional || consent.marketing);
        } catch (e) {
          console.error('[Auth] Failed to parse cookie consent', e);
          setHasConsent(false);
        }
      } else {
        setHasConsent(false);
      }
    };
    
    checkConsent();
    window.addEventListener('cookie-consent-updated', checkConsent);
    return () => window.removeEventListener('cookie-consent-updated', checkConsent);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
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
  }, [dispatch, isAuthenticated]);
};

export default useAuth;