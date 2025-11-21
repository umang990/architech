import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatedText, ParallaxImage, AnimatedButton, BackgroundParallax } from '../common/AnimationPrimitives';
import { useTheme } from '../../context/ThemeContext';

const StepSection = ({ id, title, description, imgSrc, alt, reverse = false }) => (
  <section className={`w-full min-h-[80vh] py-24 px-6 md:px-12 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 relative z-10`}>
    <div className="w-full md:w-1/2 md:pr-16">
      <div className="flex gap-4 items-center mb-6">
         <span className="text-[var(--text-secondary)] font-serif text-4xl opacity-30">{id}</span>
         <AnimatedText el="h3" text={title} className="text-[var(--text-primary)] font-serif text-3xl md:text-4xl" />
      </div>
      <AnimatedText el="p" text={description} className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10" delay={0.1} />
      <AnimatedButton>
         Learn More <ArrowRight size={14} />
      </AnimatedButton>
    </div>
    <div className="w-full md:w-1/2 h-[60vh] rounded-xl overflow-hidden shadow-2xl border border-[var(--border-color)]">
      <ParallaxImage src={imgSrc} alt={alt} className="h-full w-full" />
    </div>
  </section>
);

const HowItWorks = () => {
  const { theme } = useTheme();
  
  const bgImg = theme === 'dark'
    ? "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop";

  return (
    <div id="how-it-works" className="w-full bg-[var(--bg-primary)] relative overflow-hidden">
      <BackgroundParallax src={bgImg} opacity={0.06} />

      <div className="px-6 md:px-12 pt-32 pb-16 relative z-10">
        <AnimatedText el="p" text="( The Process )" className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)] mb-8" />
        <AnimatedText el="h2" text="From Thought to Code" className="font-serif text-5xl md:text-7xl text-[var(--text-primary)] font-light" />
      </div>
      
      <StepSection 
        id="01"
        title="Define Specification"
        description="Use natural language to define models, endpoints, and UI logic. Our LLM parser breaks it down into a structured blueprint."
        imgSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
        alt="Specification Phase"
      />
      <StepSection 
        id="02"
        title="AI-Powered Generation"
        description="Our fine-tuned model architects a production-grade codebase, writing Clean Architecture patterns in seconds."
        imgSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
        alt="Code Generation"
        reverse={true}
      />
      <StepSection 
        id="03"
        title="Deploy & Scale"
        description="Review your code in our integrated IDE, then export a Dockerized container ready for AWS or Vercel."
        // FIX: Replaced the problematic image with a more reliable "Server" image
        imgSrc="https://images.unsplash.com/photo-1558494949-efc02570fbc9?q=80&w=2070&auto=format&fit=crop"
        alt="Deployment Phase"
      />
    </div>
  );
};

export default HowItWorks;