// client/src/components/builder/ide/FileTree.jsx
import React from 'react';
import { Folder, FileCode } from 'lucide-react';

const FileTreeItem = ({ name, indent = 0, isActive, onClick, isFolder }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center gap-2 py-1 px-2 cursor-pointer select-none text-sm font-mono transition-colors
      ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}
    `}
    style={{ paddingLeft: `${indent * 12 + 8}px` }}
  >
    {isFolder ? (
      <Folder size={14} className="text-blue-400 fill-blue-400/20" />
    ) : (
      <FileCode size={14} className={name.endsWith('js') ? 'text-yellow-400' : name.endsWith('css') ? 'text-blue-300' : 'text-gray-400'} />
    )}
    <span className="truncate">{name}</span>
  </div>
);

const FileTree = ({ files, selectedFile, onSelect }) => {
  // Group flat paths into folders (e.g., "server/models/User.js" -> folder "server" -> folder "models")
  const groupedFiles = files.reduce((acc, file) => {
    const parts = file.path.split('/');
    const folder = parts.length > 1 ? parts[0] : 'root';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {});

  return (
    <div className="w-64 bg-[#181818] border-r border-white/5 flex flex-col h-full">
      <div className="p-3 text-xs font-bold text-white/40 uppercase tracking-wider border-b border-white/5">Explorer</div>
      <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
        {Object.entries(groupedFiles).map(([folder, items]) => (
          <div key={folder}>
            {folder !== 'root' && (
              <FileTreeItem name={folder} isFolder indent={1} />
            )}
            {items.map(f => (
              <FileTreeItem 
                key={f.path} 
                name={folder === 'root' ? f.path : f.path.split('/').pop()} 
                indent={folder === 'root' ? 1 : 2}
                isActive={selectedFile?.path === f.path}
                onClick={() => onSelect(f)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileTree;