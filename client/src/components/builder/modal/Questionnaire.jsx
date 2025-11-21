import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Save, Loader2, Cpu, 
  ToggleLeft, ToggleRight, Box, Zap
} from 'lucide-react';
import { AnimatedButton } from '../../common/AnimationPrimitives';

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

const Questionnaire = ({ modules = [], answers, setAnswers, onSubmit, isLoading, onClose }) => {
  const [mode, setMode] = useState('simple'); // 'simple' | 'advanced'
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

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#050505]/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-8"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1400px] h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex shadow-2xl flex-col"
      >
        {/* Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]">
           <div className="flex items-center gap-6">
              <span className="text-white font-serif text-xl">Configuration</span>
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                 <button 
                   onClick={() => setMode('simple')}
                   className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'simple' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                 >
                   Default
                 </button>
                 <button 
                   onClick={() => setMode('advanced')}
                   className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'advanced' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                 >
                   Advanced
                 </button>
              </div>
           </div>
           <button onClick={onClose} className="text-white/40 hover:text-white">Close</button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
           {mode === 'advanced' ? (
             <>
               {/* Advanced: Sidebar + Grid */}
               <div className="w-64 bg-black/40 border-r border-white/5 flex flex-col backdrop-blur-md overflow-y-auto">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModuleId(mod.id)}
                      className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all ${
                        activeModuleId === mod.id ? 'bg-white/10 text-white border-l-2 border-white' : 'text-white/60 hover:bg-white/5'
                      }`}
                    >
                      <Box size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{mod.label}</span>
                    </button>
                  ))}
               </div>
               <div className="flex-1 overflow-y-auto p-10 bg-[#0a0a0a]">
                  <h2 className="text-2xl text-white font-serif mb-2">{activeModule?.label}</h2>
                  <p className="text-white/40 text-sm mb-8">{activeModule?.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(activeModule?.config || []).map((cfg) => (
                      <div key={cfg.key} className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                         <div className="mb-4 text-sm text-white/90 font-medium">{cfg.label}</div>
                         <ControlInput 
                           config={cfg} 
                           value={localConfig[`${activeModule.id}_${cfg.key}`] ?? cfg.default} 
                           onChange={(val) => handleConfigChange(`${activeModule.id}_${cfg.key}`, val)}
                         />
                      </div>
                    ))}
                  </div>
               </div>
             </>
           ) : (
             /* Simple Mode */
             <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#808000] to-black rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(128,128,0,0.3)]">
                   <Zap size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-4">Beautiful Default</h2>
                <p className="text-white/60 max-w-xl text-lg leading-relaxed mb-12">
                   We have pre-configured a modern, high-performance stack for you. 
                   Includes Tailwind CSS, Responsive Layouts, and Best Practices out of the box.
                </p>
                <div className="grid grid-cols-2 gap-8 text-left max-w-2xl w-full">
                   <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                      <div className="text-[#808000] text-xs uppercase tracking-widest mb-2">Frontend</div>
                      <div className="text-white font-medium">React + Tailwind + Lucide</div>
                   </div>
                   <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                      <div className="text-[#808000] text-xs uppercase tracking-widest mb-2">Backend</div>
                      <div className="text-white font-medium">Express + Mongoose + JWT</div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="h-24 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-end px-10">
            <AnimatedButton onClick={onSubmit} loading={isLoading}>
              {isLoading ? 'Architecting...' : 'Apply & Generate'}
            </AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Questionnaire;