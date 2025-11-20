import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { AnimatedText, BackgroundParallax } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const testimonialsData = [
  {
    quote: "MERN Architect cut my development time by over 70%. It's like having a senior dev on call 24/7.",
    author: "Jane Doe",
    title: "Lead Developer at InnovateX",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The generated code is incredibly clean and follows best practices. It's a game-changer for startups.",
    author: "John Smith",
    title: "CTO of FutureTech Solutions",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "I was able to launch my MVP in a week, thanks to MERN Architect. Highly recommend!",
    author: "Sarah Johnson",
    title: "Founder of Creative Apps",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const Testimonials = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const bgImg = theme === 'dark'
    ? "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 bg-[var(--bg-primary)] border-t border-[var(--border-color)] relative overflow-hidden">
      <BackgroundParallax src={bgImg} opacity={0.1} />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <AnimatedText el="p" text="What Our Users Say" className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6" />
        <AnimatedText el="h2" text="Trusted by Developers Worldwide" className="font-serif text-4xl md:text-6xl font-light text-[var(--text-primary)] mb-16" />

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-3xl mx-auto bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-2xl p-8 md:p-12 shadow-lg"
            >
              <Quote size={48} className="mx-auto mb-6 opacity-20 text-[var(--text-primary)]" />
              <p className="font-serif text-2xl md:text-3xl text-[var(--text-primary)] italic mb-8 leading-relaxed">
                "{testimonialsData[currentIndex].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonialsData[currentIndex].avatar}
                  alt={testimonialsData[currentIndex].author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border-color)]"
                />
                <div>
                  <p className="font-mono text-lg text-[var(--text-primary)] font-medium">{testimonialsData[currentIndex].author}</p>
                  <p className="text-[var(--text-secondary)] text-sm">{testimonialsData[currentIndex].title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12 gap-3">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-[var(--text-primary)]' : 'bg-[var(--text-secondary)]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;