// client/src/components/common/Typography.jsx
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';
import { EASING, OLIVE_COLOR_LIGHT } from '../../utils/constants';

export const SectionTitle = ({ children, className = '' }) => (
  <AnimatedText
    el="h2"
    text={children}
    className={`font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight ${className}`}
  />
);

export const SectionSubTitle = ({ children, className = '' }) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: EASING, delay: 0.2 }}
    className="font-mono text-xs uppercase tracking-[0.2em] mb-6"
    style={{ color: OLIVE_COLOR_LIGHT }}
  >
    {children}
  </motion.p>
);

export const BodyText = ({ children, className = '' }) => (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: EASING, delay: 0.3 }}
    className={`text-base md:text-lg text-white/70 leading-relaxed max-w-xl ${className}`}
  >
    {children}
  </motion.p>
);