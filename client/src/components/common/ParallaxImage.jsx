// client/src/components/common/ParallaxImage.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASING } from '../../utils/constants';

const ParallaxImage = ({ src, alt, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    // CHANGED: Added 'relative' to the className
    <div ref={ref} className={`relative overflow-hidden rounded-xl bg-gray-900 ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: EASING }}
          viewport={{ once: true }}
          className="w-full h-full object-cover will-change-transform"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop';
          }}
        />
      </motion.div>
      {/* Overlay gradient for better text readability if text is placed over */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default ParallaxImage;