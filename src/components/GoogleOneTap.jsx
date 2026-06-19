import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const GoogleOneTap = React.memo(() => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    disabled: isAuthenticated,
    auto_select: false,
    use_fedcm_for_prompt: false,
  });

  return null;
});

export default GoogleOneTap;
