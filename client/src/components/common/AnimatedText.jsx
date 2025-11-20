// client/src/components/common/AnimatedText.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { EASING } from '../../utils/constants';

const AnimatedText = ({
  el: Wrapper = 'p',
  text,
  className,
  once = true,
  delay = 0,
  stagger = 0.01,
}) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.3 }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        aria-hidden="true"
      >
        {text.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom mr-1.5 pb-[2px]">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '100%' },
                visible: { 
                  y: '0%', 
                  transition: { duration: 0.8, ease: EASING } 
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default AnimatedText;