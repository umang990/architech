// client/src/components/builder/ide/Terminal.jsx
import React from 'react';
import { OLIVE_COLOR_LIGHT } from '../../../utils/constants';

const Terminal = () => {
  return (
    <div className="h-48 border-t border-white/10 bg-[#181818] flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 py-1 border-b border-white/5">
        <div className="flex gap-4 text-xs text-white/60">
          <span className="text-white border-b border-white cursor-pointer">TERMINAL</span>
          <span className="cursor-pointer hover:text-white">OUTPUT</span>
          <span className="cursor-pointer hover:text-white">DEBUG CONSOLE</span>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-xs text-white/70 overflow-y-auto no-scrollbar">
        <div style={{ color: OLIVE_COLOR_LIGHT }}>➜  mern-project git:(main) <span className="text-white">npm install</span></div>
        <div className="text-white/50 mt-1">added 142 packages in 3s</div>
        <div style={{ color: OLIVE_COLOR_LIGHT }} className="mt-2">➜  mern-project git:(main) <span className="text-white">npm run dev</span></div>
        <div className="text-white/50 mt-1">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
        <div className="text-blue-400 mt-1">event - compiled client and server successfully in 1241 ms (156 modules)</div>
        <div className="mt-2 animate-pulse">_</div>
      </div>
    </div>
  );
};

export default Terminal;