import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  React.useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, otp, navigate]);

  if (!email || !otp) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { 
        email: email.toLowerCase().trim(), 
        otp, 
        newPassword, 
        confirmPassword: newPassword 
      });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter your new secure password</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Lock size={20} />
          </div>
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300" 
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              Reset Password <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link to="/login" className="font-bold text-primary hover:text-indigo-500 transition-colors">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
