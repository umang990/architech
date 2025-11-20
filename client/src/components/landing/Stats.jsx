import React, { useState, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { Layers, Code, Activity } from 'lucide-react';
import { BackgroundParallax } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const useCountUp = (end, duration = 1.5) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate(0, end, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (val) => setCount(Math.floor(val)),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

const StatItem = ({ value, label, unit, icon }) => {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center relative z-10"
    >
      <div className="text-[var(--text-primary)] mb-6 p-4 bg-[var(--glass-bg)] rounded-full border border-[var(--border-color)] shadow-sm">{icon}</div>
      <div className="font-serif text-6xl md:text-8xl text-[var(--text-primary)]">
        {count}<span className="text-3xl text-[var(--text-secondary)] ml-1">{unit}</span>
      </div>
      <p className="text-xs font-sans uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-4 font-semibold">{label}</p>
    </motion.div>
  );
};

const Stats = () => {
  const { theme } = useTheme();
  
  // Dark: Blue technical nodes. Light: Clean white geometric grid.
  const bgImg = theme === 'dark'
    ? "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2574&auto=format&fit=crop";

  return (
    <section className="w-full py-32 px-6 md:px-12 bg-[var(--bg-primary)] relative overflow-hidden border-y border-[var(--border-color)]">
      <BackgroundParallax src={bgImg} opacity={0.08} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        <StatItem value={150} label="Projects Created" unit="k+" icon={<Layers size={32} />} />
        <StatItem value={24} label="Lines of Code" unit="m" icon={<Code size={32} />} />
        <StatItem value={99} label="System Uptime" unit="%" icon={<Activity size={32} />} />
      </div>
    </section>
  );
};

export default Stats;