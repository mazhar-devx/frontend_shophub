import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const GoogleOneTap = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
    use_fedcm_for_prompt: true,
  });

  return null;
};

export default GoogleOneTap;
