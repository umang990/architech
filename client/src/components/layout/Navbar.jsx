import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onLogin }) => { // Accept onLogin prop
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex justify-between items-center z-50 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--border-color)]"
    >
      <div className="font-serif text-xl font-medium text-[var(--text-primary)] tracking-tight">
        MERN Architect
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center space-x-8">
          {['Generator', 'Features', 'Stack', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="h-6 w-[1px] bg-[var(--border-color)] hidden md:block"></div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button 
          onClick={onLogin} // Connect the click handler
          className="hidden md:block px-5 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs uppercase tracking-widest rounded-full font-mono transition-transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </motion.header>
  );
};

export default Navbar;