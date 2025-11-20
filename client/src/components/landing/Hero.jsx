import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wand2, ArrowDown } from 'lucide-react';
import { AnimatedText, AnimatedButton } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const Hero = ({ prompt, setPrompt, handleFetchQuestions, isLoading, userApiKey, setUserApiKey }) => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  
  const y = useTransform(scrollYProgress, [0, 0.5], ['0%', '-100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Updated Image for Light Mode: Clean Architectural Abstract
  const bgImage = theme === 'dark' 
    ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop";

  return (
    <section ref={ref} className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
           style={{ y: yBg }} 
           className="absolute inset-0"
           initial={{ opacity: 0 }}
           animate={{ opacity: theme === 'dark' ? 0.4 : 0.3 }}
           transition={{ duration: 1 }}
        >
           <img 
             src={bgImage} 
             className="w-full h-full object-cover transition-opacity duration-1000"
             alt="Background"
           />
           {/* Gradient matches theme background */}
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/60 via-[var(--bg-primary)]/20 to-[var(--bg-primary)]" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--glass-bg)] mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full animate-pulse bg-[var(--accent)]" />
          <span className="text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)]">AI-Powered Scaffold v2.0</span>
        </div>

        <AnimatedText
          el="h1"
          text="Intelligent MERN"
          className="font-serif text-6xl md:text-8xl font-medium leading-[1.1] tracking-tight text-[var(--text-primary)]"
        />
        <AnimatedText
          el="h1"
          text="Scaffolding"
          className="font-serif text-6xl md:text-8xl font-medium leading-[1.1] tracking-tight text-[var(--text-primary)]"
          delay={0.1}
        />
        
        <AnimatedText
          el="p"
          text="From Spec to Scale. Describe your architecture. Our AI generates the production-grade codebase instantly."
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mt-8 mb-12 font-sans font-light"
          delay={0.2}
        />

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl"
        >
          <div className="relative group">
            {/* Glow effect adapted for light mode */}
            <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${theme === 'dark' ? 'bg-gradient-to-r from-[#808000] to-white/20' : 'bg-gradient-to-r from-[#000000] to-gray-400/50'}`}></div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A full-stack e-commerce site with Prisma, user auth, Stripe payments...'"
              className="relative w-full h-32 p-6 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] font-sans text-lg placeholder:text-[var(--text-secondary)] focus:border-[var(--text-primary)] focus:ring-0 outline-none transition-all resize-none shadow-2xl"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <input
              type="password"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="Gemini API Key..."
              className="flex-1 p-4 bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-full text-[var(--text-primary)] font-sans text-sm placeholder:text-[var(--text-secondary)] focus:border-[var(--text-primary)] focus:outline-none transition-all shadow-sm"
            />
            
            <AnimatedButton 
              onClick={handleFetchQuestions}
              loading={isLoading}
              className="md:w-auto w-full shadow-lg"
            >
               {isLoading ? 'Architecting...' : 'Generate App'} {!isLoading && <Wand2 size={16} />}
            </AnimatedButton>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-[var(--text-secondary)] text-xs uppercase tracking-widest font-sans"
      >
        Scroll to Explore <ArrowDown className="inline-block w-3 h-3 ml-2 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default Hero;