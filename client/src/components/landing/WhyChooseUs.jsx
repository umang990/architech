import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, MessageSquare, Monitor, Settings } from 'lucide-react';
import { AnimatedText, BackgroundParallax } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    viewport={{ once: true }}
    className="bg-[var(--glass-bg)] border border-[var(--border-color)] p-8 rounded-xl flex flex-col items-center text-center hover:border-[var(--text-primary)] transition-colors duration-300 shadow-sm"
  >
    <div className="mb-6 p-4 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]">
      <Icon size={36} strokeWidth={1.5} />
    </div>
    <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-3">{title}</h3>
    <p className="text-[var(--text-secondary)] text-base">{description}</p>
  </motion.div>
);

const WhyChooseUs = () => {
  const { theme } = useTheme();
  
  // Dark: Deep structure. Light: White/Gray geometric minimalism.
  const bgImg = theme === 'dark'
    ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-[var(--bg-primary)] relative overflow-hidden border-t border-[var(--border-color)]">
      <BackgroundParallax src={bgImg} opacity={0.05} />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
        <AnimatedText el="p" text="Why MERN Architect?" className="font-sans text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6" />
        <AnimatedText el="h2" text="Unleash Your Development Potential" className="font-serif text-4xl md:text-6xl font-light text-[var(--text-primary)] mb-8" />
        <p className="text-[var(--text-secondary)] max-w-3xl mx-auto text-lg">
           We provide the tools to transform your ideas into robust, scalable MERN applications with unprecedented speed and precision. Focus on innovation, we handle the boilerplate.
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard icon={Activity} title="Rapid Prototyping" description="Quickly generate a functional codebase to validate ideas and gather early feedback." index={0} />
        <FeatureCard icon={TrendingUp} title="Scalable Architecture" description="Built with best practices, your app is ready to scale from day one." index={1} />
        <FeatureCard icon={Users} title="Collaborative Ready" description="Export a clean, well-structured project ready for team collaboration." index={2} />
        <FeatureCard icon={MessageSquare} title="Intuitive AI Prompts" description="Describe complex features in natural language, and let AI build them." index={3} />
        <FeatureCard icon={Monitor} title="Full Stack Coverage" description="From database schemas to React components, get a complete scaffold." index={4} />
        <FeatureCard icon={Settings} title="Customizable Output" description="Tweak and refine the generated code within our integrated IDE environment." index={5} />
      </div>
    </section>
  );
};

export default WhyChooseUs;