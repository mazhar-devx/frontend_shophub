import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const GoogleOneTap = React.memo(() => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consentStr = localStorage.getItem('cookie-consent');
      if (consentStr) {
        try {
          const consent = JSON.parse(consentStr);
          // Enable Google One Tap once essential, functional or marketing cookies are allowed
          setHasConsent(consent.functional || consent.marketing || consent.essential);
        } catch (e) {
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

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      if (!isAuthenticated) {
        console.log('[Auth] Google One Tap Success');
        dispatch(googleLogin(credentialResponse.credential));
      }
    },
    onError: (error) => {
      console.warn('[Auth] Google One Tap Failed', error);
    },
    disabled: isAuthenticated || !hasConsent,
    auto_select: true, // Enable automatic login when possible
    use_fedcm_for_prompt: true, // Required for modern Chrome/Edge browsers
  });

  return null;
});

export default GoogleOneTap;
