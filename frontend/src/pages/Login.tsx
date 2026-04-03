import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter all fields');

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { 
        email: email.toLowerCase().trim(), 
        password 
      });
      login(res.data.token, res.data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">Welcome Back</h2>
        <p className="text-gray-500 dark:text-gray-400">Sign in to your intelligent workspace</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-indigo-500 transition-colors">
            Forgot your password?
          </Link>
        </div>

        <button 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              Sign In <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-indigo-500 transition-colors">
          Sign up now
        </Link>
      </p>
    </div>
  );
};

export default Login;
