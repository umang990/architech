import React, { useState } from 'react';
import { Download, Folder, FileCode, Terminal as TerminalIcon, Monitor, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../../common/AnimationPrimitives';

const FileTree = ({ files, selectedFile, onSelect }) => {
  // Group flat paths into folders
  const groupedFiles = files.reduce((acc, file) => {
    const parts = file.path.split('/');
    const folder = parts.length > 1 ? parts[0] : 'root';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {});

  return (
    <div className="h-full bg-[#0d0d0d] border-r border-white/10 overflow-y-auto p-4 font-mono text-xs">
      <div className="text-white/40 uppercase tracking-widest mb-4 text-[10px]">Explorer</div>
      {Object.entries(groupedFiles).map(([folder, items]) => (
        <div key={folder} className="mb-4">
           {folder !== 'root' && (
             <div className="flex items-center gap-2 text-white/60 mb-2">
                <Folder size={12} className="text-blue-400" /> {folder}
             </div>
           )}
           <div className={folder !== 'root' ? 'pl-4 border-l border-white/5' : ''}>
             {items.map(f => (
               <button 
                 key={f.path}
                 onClick={() => onSelect(f)}
                 className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-2 truncate transition-colors ${selectedFile?.path === f.path ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
               >
                 <FileCode size={12} /> 
                 {folder === 'root' ? f.path : f.path.split('/').pop()}
               </button>
             ))}
           </div>
        </div>
      ))}
    </div>
  );
};

const CodeEditor = ({ selectedFile, animatedCode }) => (
  <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden">
    <div className="h-10 bg-[#0a0a0a] border-b border-white/5 flex items-center px-4 text-xs text-white/60 font-mono">
      {selectedFile ? selectedFile.path : 'Select a file'}
    </div>
    <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed text-gray-300">
       <code dangerouslySetInnerHTML={{ __html: animatedCode }} />
       <span className="inline-block w-2 h-4 bg-white/50 animate-pulse ml-1" />
    </div>
  </div>
);

const GeneratorInterface = ({ files, selectedFile, onSelect, status, animatedCode, onDownload, error }) => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
           <div className="text-white font-serif text-xl">Builder</div>
           <div className="h-4 w-[1px] bg-white/10"></div>
           <div className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             {status}
           </div>
        </div>
        
        <AnimatedButton onClick={onDownload} className="!py-2 !px-6">
           <Download size={14} className="mr-2" /> Download ZIP
        </AnimatedButton>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="bg-red-900/20 border-b border-red-500/30 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center gap-3 text-red-200 text-sm">
               <AlertTriangle size={16} /> {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-2 h-full">
          <FileTree files={files} selectedFile={selectedFile} onSelect={onSelect} />
        </div>
        <div className="col-span-10 h-full flex flex-col">
          <CodeEditor selectedFile={selectedFile} animatedCode={animatedCode} />
          <div className="h-48 bg-[#0d0d0d] border-t border-white/10 p-4 font-mono text-xs text-white/50 overflow-auto">
             <div className="mb-2 text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Terminal Output</div>
             <div className="text-green-400">$ initializing build sequence...</div>
             <div className="text-white/60">loaded configuration modules.</div>
             <div className="text-white/60">generating file structure...</div>
             {status && <div className="text-blue-400">$ {status.toLowerCase()}</div>}
             <div className="animate-pulse mt-1">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorInterface;