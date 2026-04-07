import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      await api.post('/auth/forgot-password', { email: normalizedEmail });
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email: normalizedEmail } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
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
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-500 mb-2">Forgot Password</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter your email to receive an OTP</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Mail size={20} />
          </div>
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300" 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              Send OTP <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-indigo-500 transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;
