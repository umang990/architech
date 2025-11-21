import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton } from '../common/AnimationPrimitives';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = isLogin 
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password);
      
      if (success) {
        onClose();
      }
    } catch (err) {
      // Helper to extract the specific message from the backend response
      const message = err.response?.data?.message || err.message || 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl"
          >
             <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                   <div>
                     <h2 className="font-serif text-3xl text-[var(--text-primary)] mb-2">
                       {isLogin ? 'Welcome Back' : 'Join the Architects'}
                     </h2>
                     <p className="text-[var(--text-secondary)] text-sm">
                       {isLogin ? 'Enter your credentials to access your workspace.' : 'Create an account to start building.'}
                     </p>
                   </div>
                   <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                     <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                   {!isLogin && (
                     <div className="space-y-2">
                       <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">Full Name</label>
                       <div className="relative">
                         <User className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={16} />
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:border-[var(--text-primary)] outline-none transition-colors"
                           placeholder="John Doe"
                           required
                         />
                       </div>
                     </div>
                   )}
                   
                   <div className="space-y-2">
                     <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">Email Address</label>
                     <div className="relative">
                       <Mail className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={16} />
                       <input 
                         type="email" 
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:border-[var(--text-primary)] outline-none transition-colors"
                         placeholder="architect@example.com"
                         required
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">Password</label>
                     <div className="relative">
                       <Lock className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={16} />
                       <input 
                         type="password" 
                         value={formData.password}
                         onChange={e => setFormData({...formData, password: e.target.value})}
                         className="w-full bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:border-[var(--text-primary)] outline-none transition-colors"
                         placeholder="••••••••"
                         required
                       />
                     </div>
                   </div>

                   {error && <div className="text-red-400 text-xs bg-red-900/20 p-3 rounded-lg border border-red-500/20">{error}</div>}

                   <AnimatedButton type="submit" loading={loading} className="w-full mt-6">
                     {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                   </AnimatedButton>
                </form>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline decoration-dotted underline-offset-4"
                  >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
                  </button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;