import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, Save, Loader2, Cpu, 
  ToggleLeft, ToggleRight,
  Shield, Database, Layout, Server, Globe, Terminal, Lock, Zap, Box, Activity, Users, Cloud, Smartphone, Code, CreditCard, MessageSquare, ShoppingCart, Video, GitBranch
} from 'lucide-react';
import { AnimatedButton } from '../../common/AnimationPrimitives';

// Map string names from AI to actual components
const ICON_MAP = {
  Shield, Database, Layout, Server, Globe, Terminal, Lock, Zap, Box, Activity, Users, Cloud, Smartphone, Code, CreditCard, MessageSquare, ShoppingCart, Video, GitBranch
};

const ControlInput = ({ config, value, onChange }) => {
  if (config.type === 'toggle') {
    return (
      <button 
        onClick={() => onChange(!value)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${value ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-white/50'}`}
      >
        {value ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        <span className="text-xs font-sans uppercase tracking-wider">{value ? 'Active' : 'Disabled'}</span>
      </button>
    );
  }

  if (config.type === 'select') {
    return (
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none appearance-none font-sans transition-colors"
        >
          {config.options?.map(opt => <option key={opt} value={opt} className="bg-black text-white">{opt}</option>)}
        </select>
        <ChevronRight className="absolute right-3 top-3.5 text-white/30 rotate-90 pointer-events-none" size={14} />
      </div>
    );
  }

  return (
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none font-mono transition-colors"
    />
  );
};

const Questionnaire = ({ modules = [], answers, setAnswers, onSubmit, isLoading }) => {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [localConfig, setLocalConfig] = useState({});

  useEffect(() => {
    if (modules && modules.length > 0) {
      setActiveModuleId(modules[0].id);
      const defaults = {};
      modules.forEach(mod => {
        if (Array.isArray(mod.config)) {
            mod.config.forEach(cfg => {
                defaults[`${mod.id}_${cfg.key}`] = cfg.default;
            });
        }
      });
      setLocalConfig(prev => ({ ...defaults, ...prev, ...answers }));
    }
  }, [modules]);

  useEffect(() => {
    setAnswers(localConfig);
  }, [localConfig, setAnswers]);

  const handleConfigChange = (key, value) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  if (!modules || modules.length === 0) return null;

  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const ActiveIcon = ICON_MAP[activeModule?.icon] || Box;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center p-4 md:p-8"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1400px] h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex shadow-2xl"
      >
        
        {/* SIDEBAR */}
        <div className="w-64 bg-black/40 border-r border-white/5 flex flex-col backdrop-blur-md">
          <div className="p-8 border-b border-white/5">
            <div className="text-white font-serif text-xl mb-1 flex items-center gap-2">
              Blueprint
            </div>
            <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Configuration Mode</div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {modules.map((mod) => {
              const Icon = ICON_MAP[mod.icon] || Box;
              const isActive = activeModuleId === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group ${
                    isActive ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-black' : 'text-white/60 group-hover:text-white'} />
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider">{mod.label}</div>
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a] relative">
          <div className="h-24 border-b border-white/5 flex items-center justify-between px-10">
            <div>
              <h2 className="text-3xl text-white font-serif flex items-center gap-4">
                <ActiveIcon size={28} className="text-white/80" />
                {activeModule?.label || 'Module'}
              </h2>
              <p className="text-white/40 text-sm mt-2 font-sans">{activeModule?.description}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(activeModule?.config || []).map((cfg) => (
                <motion.div 
                  key={cfg.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/20 transition-colors duration-300"
                >
                   <div className="flex justify-between items-start mb-4">
                     <label className="text-sm text-white/90 font-medium">{cfg.label}</label>
                   </div>
                   <ControlInput 
                     config={cfg} 
                     value={localConfig[`${activeModule.id}_${cfg.key}`] ?? cfg.default} 
                     onChange={(val) => handleConfigChange(`${activeModule.id}_${cfg.key}`, val)}
                   />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-24 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-between px-10">
            <div className="text-xs text-white/30 font-mono uppercase tracking-widest">
              System Status: Ready for Compilation
            </div>
            
            <AnimatedButton onClick={onSubmit} loading={isLoading}>
              {isLoading ? 'Architecting...' : 'Generate Build'}
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Questionnaire;