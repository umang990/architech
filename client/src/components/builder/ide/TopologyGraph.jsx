// client/src/components/builder/ide/TopologyGraph.jsx
import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Handle, 
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Database, Shield, Globe, Server, Cpu, Code2, Zap } from 'lucide-react';

// --- CUSTOM NODE DESIGNS ---

// 1. The Center Node (The "Core")
const CoreNode = () => (
  <div className="w-24 h-24 rounded-full bg-black border-2 border-[#808000] shadow-[0_0_30px_rgba(128,128,0,0.4)] flex flex-col items-center justify-center relative group">
    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#A0A000]" />
    <Cpu size={32} className="text-white mb-1 relative z-10" />
    <div className="text-[10px] text-[#A0A000] font-mono tracking-widest z-10">CORE</div>
    <Handle type="source" position={Position.Right} className="opacity-0" />
    <Handle type="target" position={Position.Left} className="opacity-0" />
    <Handle type="source" position={Position.Top} className="opacity-0" />
    <Handle type="source" position={Position.Bottom} className="opacity-0" />
  </div>
);

// 2. The Option Node (The "Satellite")
const OptionNode = ({ data }) => {
  const Icon = data.icon || Code2;
  
  return (
    <div 
      onClick={data.onClick}
      className="w-48 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:border-[#A0A000] hover:scale-105 hover:shadow-[0_0_20px_rgba(128,128,0,0.2)]"
    >
      <Handle type="target" position={Position.Left} style={{ background: 'transparent' }} />
      <Handle type="source" position={Position.Right} style={{ background: 'transparent' }} />
      
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#A0A000]">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-white text-sm font-medium truncate">{data.label}</div>
        <div className="text-[10px] text-white/40 font-mono uppercase">Click to Connect</div>
      </div>
    </div>
  );
};

// --- MAIN GRAPH COMPONENT ---

const nodeTypes = { core: CoreNode, option: OptionNode };

const TopologyGraph = ({ options, onSelect }) => {
  // 1. Calculate Radial Positions
  const initialNodes = useMemo(() => {
    const radius = 250; // Distance from center
    const center = { x: 300, y: 200 };
    
    // Core Node
    const nodes = [{
      id: 'core',
      type: 'core',
      position: center,
      data: { label: 'App' }
    }];

    // Satellite Nodes (Options)
    options.forEach((opt, index) => {
      const angle = (index / options.length) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      
      // Helper to guess icon based on text
      let Icon = Code2;
      if (opt.toLowerCase().includes('db') || opt.includes('Mongo')) Icon = Database;
      if (opt.toLowerCase().includes('auth')) Icon = Shield;
      if (opt.toLowerCase().includes('cloud')) Icon = Globe;
      if (opt.toLowerCase().includes('server')) Icon = Server;

      nodes.push({
        id: `opt-${index}`,
        type: 'option',
        position: { x, y },
        data: { 
          label: opt, 
          icon: Icon,
          onClick: () => onSelect(opt) 
        }
      });
    });

    return nodes;
  }, [options, onSelect]);

  // 2. Create Connections (Edges)
  const initialEdges = useMemo(() => {
    return options.map((_, index) => ({
      id: `e-core-${index}`,
      source: 'core',
      target: `opt-${index}`,
      animated: true,
      style: { stroke: '#333', strokeWidth: 2 },
    }));
  }, [options]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[400px] md:h-[500px] bg-[#080808] rounded-xl border border-white/10 overflow-hidden relative">
      {/* Decor */}
      <div className="absolute top-4 left-4 text-xs font-mono text-[#A0A000] flex items-center gap-2 z-10">
        <Zap size={12} /> TOPOLOGY VIEW_MODE_ACTIVE
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#333" gap={20} size={1} />
      </ReactFlow>
      
      {/* Overlay instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono bg-black/50 px-4 py-1 rounded-full backdrop-blur">
        Select a node to integrate module
      </div>
    </div>
  );
};

export default TopologyGraph;