// client/src/components/builder/ide/CodeEditor.jsx
import React, { useEffect, useRef } from 'react';
import { FileCode } from 'lucide-react';
import { OLIVE_COLOR_LIGHT } from '../../../utils/constants';

const CodeEditor = ({ selectedFile, animatedCode }) => {
  const codeContainerRef = useRef(null);

  // Auto-scroll to bottom as code generates
  useEffect(() => {
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
    }
  }, [animatedCode]);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] h-full overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex bg-[#181818]">
        {selectedFile && (
          <div className="px-4 py-2 bg-[#1e1e1e] text-sm text-white border-t-2 border-blue-500 flex items-center gap-2 min-w-[120px]">
            <FileCode size={14} className="text-blue-400" />
            {selectedFile.path.split('/').pop()}
          </div>
        )}
      </div>
      
      {/* Main Editor Area */}
      <div ref={codeContainerRef} className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 custom-scrollbar">
        <div className="flex min-h-full">
          {/* Line Numbers */}
          <div className="text-white/20 pr-4 select-none text-right min-w-[2rem] border-r border-white/5 mr-4">
            {Array.from({length: Math.max(20, animatedCode.split('\n').length)}).map((_, i) => (
              <div key={i}>{i+1}</div>
            ))}
          </div>
          
          {/* Code Content */}
          <div className="w-full whitespace-pre font-normal">
            <code dangerouslySetInnerHTML={{ __html: animatedCode }} />
            <span className="inline-block w-2 h-5 align-middle animate-pulse ml-1" style={{ backgroundColor: OLIVE_COLOR_LIGHT }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;