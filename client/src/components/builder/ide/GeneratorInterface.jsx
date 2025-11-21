import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, Folder, FileCode, AlertTriangle, 
  Sparkles, Mic, Plus, Play, Settings, RotateCw, 
  ChevronDown, ChevronRight, Code, Eye, Search, ArrowLeft, Square,
  ChevronLeft, History
} from 'lucide-react';
import { AnimatedButton } from '../../common/AnimationPrimitives';
import api from '../../../api'; 

// ... (FileTree and CodeEditor components remain the same)
const FileTree = ({ files, selectedFile, onSelect }) => {
  const groupedFiles = files.reduce((acc, file) => {
    const parts = file.path.split('/');
    const folder = parts.length > 1 ? parts[0] : 'root';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {});

  const [expanded, setExpanded] = useState({});
  useEffect(() => {
    const newExpanded = { ...expanded };
    Object.keys(groupedFiles).forEach(key => {
      if (newExpanded[key] === undefined) newExpanded[key] = true;
    });
    setExpanded(newExpanded);
  }, [files]);

  const toggle = (folder) => setExpanded(p => ({...p, [folder]: !p[folder]}));
  const isExpanded = (folder) => expanded[folder] !== false;

  return (
    <div className="h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col text-sm font-sans">
      <div className="p-3 border-b border-white/10 flex items-center justify-between text-white/60">
         <span className="text-xs uppercase tracking-wider font-semibold">Files</span>
         <div className="flex gap-2">
            <Search size={14} className="hover:text-white cursor-pointer" />
            <Plus size={14} className="hover:text-white cursor-pointer" />
         </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(groupedFiles).map(([folder, items]) => (
          <div key={folder}>
             {folder !== 'root' && (
               <button onClick={() => toggle(folder)} className="w-full flex items-center gap-1 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  {isExpanded(folder) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Folder size={14} className="text-blue-400 ml-1" />
                  <span className="truncate">{folder}</span>
               </button>
             )}
             {isExpanded(folder) && (
               <div className={folder !== 'root' ? 'pl-4' : ''}>
                 {items.map(f => (
                   <button 
                     key={f.path}
                     onClick={() => onSelect(f)}
                     className={`w-full text-left py-1.5 px-4 flex items-center gap-2 truncate transition-colors border-l-2 ${selectedFile?.path === f.path ? 'bg-white/10 text-white border-blue-500' : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'}`}
                   >
                     <FileCode size={13} /> 
                     <span className="truncate text-[13px]">{folder === 'root' ? f.path : f.path.split('/').pop()}</span>
                   </button>
                 ))}
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeEditor = ({ selectedFile, animatedCode }) => (
  <div className="h-full bg-[#050505] flex flex-col overflow-hidden relative">
    <div className="absolute top-4 right-4 z-10 flex gap-2">
       <span className="text-xs text-white/30 font-mono">
         {selectedFile ? `${selectedFile.path.split('.').pop().toUpperCase()} • UTF-8` : ''}
       </span>
    </div>
    {!selectedFile ? (
      <div className="flex-1 flex flex-col items-center justify-center text-white/20">
         <Code size={48} strokeWidth={1} className="mb-4" />
         <p>Select a file to view code</p>
      </div>
    ) : (
      <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-gray-300">
         <div className="flex">
            <div className="flex flex-col text-right pr-4 text-white/20 select-none text-[13px] leading-relaxed border-r border-white/5 mr-4">
               {(animatedCode || '').split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div className="flex-1 min-w-0">
               <code className="whitespace-pre block" dangerouslySetInnerHTML={{ __html: (animatedCode || '').replace(/</g, '&lt;') }} />
               <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1 align-middle" />
            </div>
         </div>
      </div>
    )}
  </div>
);

const ChatPanel = ({ projectId, prompt, status, error, logs, onBack, onStop, onSettings }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); 
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { 
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight; 
    }
  }, [history, logs]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    const userMsg = { role: 'user', text: input };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    try {
      const { data } = await api.post(`/projects/${projectId}/chat`, { message: userMsg.text });
      if (data.success) setHistory(prev => [...prev, data.message]);
    } catch (err) { 
      setHistory(prev => [...prev, { role: 'ai', text: 'Error sending message.' }]); 
    } finally { 
      setSending(false); 
    }
  };

  const isRunning = status !== 'System Ready' && status !== 'Stopped' && status !== 'Failed' && !error && status !== 'Completed';

  return (
    <div className="h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col">
       <div className="h-14 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 text-white font-medium">
             <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"><ArrowLeft size={18} /></button>
             <Sparkles size={16} className="text-blue-400" />
             <span>Architect</span>
          </div>
          <button onClick={onSettings} className="text-white/40 hover:text-white transition-colors" title="Open Configuration">
             <Settings size={18} />
          </button>
       </div>
       
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/5">
             <div className="text-xs font-mono text-white/40 mb-2 uppercase tracking-wider">Spec</div>
             <div className="text-white text-sm italic">"{prompt}"</div>
          </div>
          {logs && logs.length > 0 && (
             <div className="space-y-1 font-mono text-xs">
                {logs.map((log, i) => (
                   <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-red-400' : 'text-white/40'}`}>
                      <span className="flex-shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], {hour12:false})}]</span>
                      <span className="break-all">{log.message}</span>
                   </div>
                ))}
             </div>
          )}
          {history.map((msg, i) => (
             <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isRunning && <div className="flex justify-center py-2 sticky bottom-0"><button onClick={onStop} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-full text-xs">Stop</button></div>}
       </div>
       <div className="p-4 border-t border-white/10">
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-xl p-1">
             <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key==='Enter' && !e.shiftKey && handleSend()} placeholder="Ask about project..." className="w-full bg-transparent border-none outline-none text-white text-sm px-3 py-2 resize-none h-12 placeholder:text-white/30"/>
             <div className="flex justify-end px-2 pb-1"><button onClick={handleSend} disabled={sending} className="p-1.5 bg-white text-black rounded-lg"><Play size={14} fill="currentColor" /></button></div>
          </div>
       </div>
    </div>
  );
};

const GeneratorInterface = ({ prompt, files, selectedFile, onSelect, status, animatedCode, onDownload, error, logs, projectId, onBack, onStop, onOpenSettings, currentVersion, onVersionChange }) => {
  const [viewMode, setViewMode] = useState('code');

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex font-sans text-white">
      <div className="w-[400px] flex-shrink-0 hidden md:block">
         <ChatPanel projectId={projectId} prompt={prompt} status={status} error={error} logs={logs} onBack={onBack} onStop={onStop} onSettings={onOpenSettings} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
         <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0a]">
            <div className="flex items-center gap-4">
                <div className="flex bg-[#1a1a1a] p-1 rounded-lg border border-white/5">
                   <button onClick={() => setViewMode('code')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'code' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                     <Code size={14} /> Code
                   </button>
                   <button onClick={() => setViewMode('preview')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                     <Eye size={14} /> Preview
                   </button>
                </div>
                {currentVersion !== undefined && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] px-2 py-1 rounded-lg border border-white/5">
                     <button onClick={() => onVersionChange(-1)} className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"><ChevronLeft size={14} /></button>
                     <span className="text-xs font-mono text-white/80 w-16 text-center flex items-center justify-center gap-1"><History size={10} /> v{currentVersion}</span>
                     <button onClick={() => onVersionChange(1)} className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"><ChevronRight size={14} /></button>
                  </div>
                )}
            </div>
            <div className="flex items-center gap-4">
               {selectedFile && (
                 <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs">
                    <FileCode size={12} /> {selectedFile.path}
                 </div>
               )}
               <AnimatedButton onClick={onDownload} className="!py-1.5 !px-4 !text-xs !h-auto">
                  <Download size={12} className="mr-2" /> Export
               </AnimatedButton>
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            <div className="w-64 flex-shrink-0 hidden lg:block">
               <FileTree files={files} selectedFile={selectedFile} onSelect={onSelect} />
            </div>
            <div className="flex-1 relative">
               {viewMode === 'code' ? (
                 <CodeEditor selectedFile={selectedFile} animatedCode={animatedCode} />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center bg-[#0d0d0d] text-white/30">
                    <Eye size={48} className="mb-4 opacity-50" />
                    <p>Preview Mode (Coming Soon)</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default GeneratorInterface;