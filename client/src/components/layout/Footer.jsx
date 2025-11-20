// client/src/components/layout/Footer.jsx
import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/10 bg-[#050505]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-sm">
      <div>© 2025 MERN Architect AI. All rights reserved.</div>
      <div className="flex gap-6">
        <Github className="hover:text-white cursor-pointer transition-colors" size={20} />
        <Linkedin className="hover:text-white cursor-pointer transition-colors" size={20} />
        <Globe className="hover:text-white cursor-pointer transition-colors" size={20} />
      </div>
    </div>
  </footer>
);

export default Footer;