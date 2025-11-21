import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Settings, LogOut, 
  User, Plus, ChevronLeft, ChevronRight, FileCode, Loader2, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const DashboardLayout = ({ children, onNewProject, onLoadProject }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('builder'); 
  
  const [projects, setProjects] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get('/projects/my-projects');
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation(); // Prevent opening the project
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      // Remove from UI immediately
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      console.error("Failed to delete project", err);
      // FIX: Show specific server error message if available
      const msg = err.response?.data?.message || "Failed to delete project.";
      alert(msg);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500">
      
      {/* SIDEBAR */}
      <div className={`relative flex flex-col border-r border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-[var(--border-color)]">
          {!collapsed ? (
             <span className="font-serif text-xl text-[var(--text-primary)] tracking-tight">Architect</span>
          ) : (
             <span className="font-serif text-xl text-[var(--text-primary)]">A.</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
           <SidebarItem 
             icon={Plus} 
             label="New Project" 
             collapsed={collapsed} 
             active={activeTab === 'builder'}
             onClick={() => { setActiveTab('builder'); onNewProject(); }} 
             primary 
           />
           <div className="my-4 border-t border-[var(--border-color)] opacity-50" />
           
           <SidebarItem 
             icon={LayoutDashboard} 
             label="Active Blueprint" 
             collapsed={collapsed} 
             active={activeTab === 'builder'}
             onClick={() => setActiveTab('builder')} 
           />
           
           <SidebarItem 
             icon={History} 
             label="Past Projects" 
             collapsed={collapsed} 
             active={activeTab === 'history'}
             onClick={() => setActiveTab('history')} 
           />

           {/* History Sub-list */}
           {!collapsed && activeTab === 'history' && (
             <div className="ml-4 pl-4 border-l border-[var(--border-color)] space-y-1 mt-2">
               {loadingHistory ? (
                 <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] p-2">
                   <Loader2 size={12} className="animate-spin" /> Loading...
                 </div>
               ) : projects.length > 0 ? (
                 projects.map(p => (
                   <div key={p._id} className="group flex items-center justify-between pr-2 rounded hover:bg-[var(--text-primary)]/5 transition-colors">
                     <button 
                       onClick={() => { onLoadProject(p._id); }} 
                       className="block flex-1 text-left text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate py-2 px-2 transition-colors"
                     >
                       {p.name}
                     </button>
                     <button 
                        onClick={(e) => handleDeleteProject(p._id, e)}
                        className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Project"
                     >
                        <Trash2 size={12} />
                     </button>
                   </div>
                 ))
               ) : (
                 <div className="text-xs text-[var(--text-secondary)] p-2">No projects yet</div>
               )}
             </div>
           )}

           <SidebarItem 
             icon={Settings} 
             label="Configuration" 
             collapsed={collapsed} 
             active={activeTab === 'settings'}
             onClick={() => setActiveTab('settings')} 
           />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--glass-bg)]">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--text-primary)] flex items-center justify-center text-sm font-bold text-[var(--bg-primary)] shadow-lg">
               {user?.name?.[0]?.toUpperCase() || 'U'}
             </div>
             {!collapsed && (
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</div>
                 <div className="text-xs text-[var(--text-secondary)] truncate opacity-70">{user?.email}</div>
               </div>
             )}
          </div>
          {!collapsed && (
            <button 
              onClick={logout}
              className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 py-2 rounded-lg transition-all w-full"
            >
               <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-md z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[var(--bg-primary)]">
        {children}
      </div>

    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, collapsed, active, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
      primary 
        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-md' 
        : active 
          ? 'bg-[var(--text-primary)]/10 text-[var(--text-primary)] font-medium' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <Icon size={20} strokeWidth={1.5} />
    {!collapsed && <span className="text-sm">{label}</span>}
    
    {collapsed && (
      <div className="absolute left-full ml-4 px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
        {label}
      </div>
    )}
  </button>
);

export default DashboardLayout;