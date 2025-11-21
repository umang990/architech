import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const AnimatedText = ({
  el: Wrapper = 'p',
  text,
  className,
  once = true,
  delay = 0,
}) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once, margin: "-10%" }}
        transition={{ 
          duration: 0.8, 
          delay, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="block"
      >
        {text}
      </motion.span>
    </Wrapper>
  );
};

export const ParallaxImage = ({ src, alt, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-lg ${className} relative`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-10%" }}
        className="w-full h-full object-cover will-change-transform"
        onError={(e) => {
           // FIX: Fallback to a reliable placeholder if Unsplash fails (DNS/Network issues)
           e.target.onerror = null; // Prevent infinite loop
           e.target.src = "https://placehold.co/800x600/1a1a1a/666666?text=Image+Unavailable";
        }}
      />
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
};

export const BackgroundParallax = ({ src, opacity = 0.2 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div style={{ y }} className="absolute inset-0">
        <img 
          src={src} 
          alt="background" 
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity }}
          onError={(e) => {
             e.target.style.display = 'none'; // Hide background if it fails to load
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
      </motion.div>
    </div>
  );
};

export const AnimatedButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`group relative inline-flex items-center justify-center px-8 py-4 bg-[var(--glass-bg)] text-[var(--text-primary)] font-sans text-xs uppercase tracking-widest rounded-full overflow-hidden border border-[var(--border-color)] hover:border-[var(--text-primary)] transition-colors duration-300 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    <div className="absolute inset-0 bg-[var(--text-primary)] w-full h-full transform transition-transform duration-500 ease-out origin-left -translate-x-full group-hover:translate-x-0" />
    <span className="relative z-10 transition-colors duration-500 group-hover:text-[var(--bg-primary)] flex items-center gap-2">
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {children}
    </span>
  </button>
);