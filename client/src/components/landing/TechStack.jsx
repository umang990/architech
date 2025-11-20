import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedText, BackgroundParallax } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const techItems = [
  { title: 'Next.js', desc: 'Production React Framework', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop' },
  { title: 'Node.js', desc: 'Scalable Runtime', img: 'https://images.unsplash.com/photo-1627398242450-2701705a6e81?q=80&w=2157&auto=format&fit=crop' },
  { title: 'MongoDB', desc: 'Document Database', img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop' },
  { title: 'Prisma', desc: 'Type-safe ORM', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' },
  { title: 'Tailwind', desc: 'Utility-first CSS', img: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop' },
  { title: 'Docker', desc: 'Containerization', img: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=2071&auto=format&fit=crop' },
];

const TechCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group relative h-[400px] w-full rounded-xl overflow-hidden bg-[var(--glass-bg)] border border-[var(--border-color)] shadow-sm"
  >
    <img
      src={item.img}
      alt={item.title}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 ease-out"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent" />
    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
      <h3 className="font-serif text-3xl text-[var(--text-primary)] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
      <p className="font-sans text-sm text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.desc}</p>
    </div>
  </motion.div>
);

const TechStack = () => {
  const { theme } = useTheme();
  
  // Dark: Matrix Code. Light: Abstract White Technology.
  const bgImg = theme === 'dark'
    ? "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  return (
    <section id="stack" className="w-full py-32 px-6 md:px-12 bg-[var(--bg-primary)] relative overflow-hidden">
      <BackgroundParallax src={bgImg} opacity={0.05} />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <AnimatedText el="h2" text="Our Technology Stack" className="font-serif text-5xl text-[var(--text-primary)] mb-6" />
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto font-sans">Built on the bleeding edge of the JavaScript ecosystem.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techItems.map((item, i) => (
            <TechCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;