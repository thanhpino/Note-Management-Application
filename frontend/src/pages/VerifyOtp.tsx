import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { motion } from 'framer-motion';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  React.useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');

    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      await api.post('/auth/verify-otp', { email: normalizedEmail, otp });
      toast.success('OTP Verified');
      navigate('/reset-password', { state: { email: normalizedEmail, otp } });

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500 mb-2">Verify OTP</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to {email}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <KeyRound size={20} />
          </div>
          <input 
            type="text" 
            placeholder="OTP Code" 
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 tracking-widest text-lg font-bold" 
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              Verify <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default VerifyOtp;
