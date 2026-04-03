import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { IMAGE_URL, DEFAULT_AVATAR, getProductImageUrl } from "../utils/constants";

export default function Profile() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState(null);

  const [preview, setPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state with user data when it loads
  useEffect(() => {
    if (user) {
        setName(user.name || '');
        setPreview(user.photo ? getProductImageUrl(user.photo) : null);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    
    const formData = new FormData();
    formData.append('name', name);
    if (photo) {
      formData.append('photo', photo);
    }

    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      setSuccessMsg('Profile updated successfully!');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 flex justify-center items-start">
      <div className="glass w-full max-w-2xl p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-white mb-8 relative z-10">Your Profile</h2>

        {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
                {error}
            </div>
        )}
        
        {successMsg && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
                {successMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-xl bg-black/40 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={DEFAULT_AVATAR} alt="Default Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">{user?.name || 'User'}</h3>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">{user?.role || 'Customer'}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium placeholder-gray-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2 opacity-50 pointer-events-none" title="Email cannot be changed">
              <label className="text-sm text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-gray-400 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transform transition-all active:scale-95 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
