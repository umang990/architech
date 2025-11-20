import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-primary)]"
    >
      <div className="flex flex-col items-center relative">
        
        {/* Masked Text Reveal */}
        <div className="overflow-hidden mb-4">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="font-serif text-4xl md:text-6xl text-[var(--text-primary)] tracking-tight"
          >
            MERN Architect
          </motion.h1>
        </div>

        {/* Expanding Line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          className="w-24 h-[1px] bg-[var(--accent)] origin-center"
        />

        {/* Fading Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute -bottom-8 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)]"
        >
          Initializing
        </motion.p>

      </div>
    </motion.div>
  );
};

export default Preloader;