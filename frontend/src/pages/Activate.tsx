import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Activate: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const { setUser } = useAuth();

  useEffect(() => {
    if (token) {
      api.get(`/auth/activate/${token}`)
        .then(() => {
          setStatus('success');
          // Tải lại profile để cập nhật trạng thái is_verified
          api.get('/users/profile').then(res => setUser(res.data)).catch(() => { });
        })
        .catch(() => setStatus('error'));
    }
  }, [token, setUser]);

  return (
    <div className="w-full flex flex-col items-center text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="animate-spin text-primary w-20 h-20 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Activating Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we verify your email...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Email Verified!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Your account has been successfully activated.</p>
          <Link to="/" className="w-full bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
            Go to Dashboard
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="text-red-500 w-24 h-24 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Activation Failed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The link might be invalid or has expired.</p>
          <Link to="/login" className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3.5 px-4 rounded-xl transition-all">
            Return to Login
          </Link>
        </>
      )}
    </div>
  );
};

export default Activate;
