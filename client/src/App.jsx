import React, { useState, useEffect } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import Preloader from './components/layout/Preloader';
import Navbar from './components/layout/Navbar';
import Hero from './components/landing/Hero';
import Stats from './components/landing/Stats';
import HowItWorks from './components/landing/HowItWorks';
import WhyChooseUs from './components/landing/WhyChooseUs';
import TechStack from './components/landing/TechStack';
import Testimonials from './components/landing/Testimonials';
import Footer from './components/layout/Footer';
import Questionnaire from './components/builder/modal/Questionnaire';
import GeneratorInterface from './components/builder/ide/GeneratorInterface';
import AuthModal from './components/auth/AuthModal';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ErrorBoundary from './components/common/ErrorBoundary'; 
import { AlertTriangle } from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchClarifyingQuestions } from './services/aiService';
import api from './api';

const MainContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const { scrollY } = useScroll();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step, setStep] = useState('intro'); 
  const [error, setError] = useState(null);

  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [config, setConfig] = useState({}); 
  const [generatedModules, setGeneratedModules] = useState([]);
  
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectState, setProjectState] = useState(null); 
  const [isPolling, setIsPolling] = useState(false);

  // NEW: Settings & Versioning State
  const [showSettings, setShowSettings] = useState(false);
  const [viewingVersion, setViewingVersion] = useState(null); // null = Latest/Head

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const unsubscribeScroll = scrollY.on('change', (latest) => {
      setShowNav(latest > 100);
    });
    return () => {
      clearTimeout(timer);
      unsubscribeScroll();
    };
  }, [scrollY]);

  useEffect(() => {
    let interval;
    if (activeProjectId && isPolling) {
      const fetchProjectStatus = async () => {
        try {
          const { data } = await api.get(`/projects/${activeProjectId}`);
          if (data.success) {
            setProjectState(data.project);
            // If generation finished, stop polling
            if (['completed', 'failed', 'stopped'].includes(data.project.status)) {
              setIsPolling(false);
            }
          }
        } catch (err) {
          console.error("Polling error", err);
          setIsPolling(false); 
        }
      };
      fetchProjectStatus();
      interval = setInterval(fetchProjectStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [activeProjectId, isPolling]);

  const startArchitectSession = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!prompt) return;
    
    setError(null);
    try {
      const schema = await fetchClarifyingQuestions(prompt);
      if (schema && schema.length > 0) {
        setGeneratedModules(schema);
        setStep('dashboard');
      } else {
        throw new Error("Architect failed to generate a valid blueprint.");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  // Initial Generation
  const startGeneration = async () => {
    setStep('building');
    setError(null);
    setProjectState(null); 
    
    try {
      const { data } = await api.post('/projects/start', {
        prompt,
        config,
        name: prompt.substring(0, 30) 
      });

      if (data.success) {
        setActiveProjectId(data.projectId);
        setIsPolling(true); 
      }
    } catch (e) {
      setError("Failed to start generation process.");
      setStep('intro');
    }
  };

  // NEW: Handle Updates (Incremental Generation)
  const handleUpdateProject = async () => {
    if (!activeProjectId) return;
    setShowSettings(false); // Close modal
    setIsPolling(true); // Restart polling to see log updates
    
    try {
      const { data } = await api.post(`/projects/${activeProjectId}/update`, {
        config, // Send modified config
        prompt // Send potentially modified prompt
      });
      
      if (data.success) {
        // Switch back to latest view if looking at history
        setViewingVersion(null); 
      }
    } catch (e) {
      setError("Failed to update project.");
    }
  };

  const loadExistingProject = (projectId) => {
    setProjectState(null); 
    setActiveProjectId(projectId);
    setIsPolling(true); 
    setStep('building'); 
    setViewingVersion(null);
  };

  const downloadZip = () => {
    const currentFiles = getViewFiles();
    if (!currentFiles.length) return;
    const zip = new JSZip();
    currentFiles.forEach(f => zip.file(f.path, f.code));
    zip.generateAsync({type:'blob'}).then(c => saveAs(c, 'mern-project.zip'));
  };

  const handleStopGeneration = async () => {
    if (!activeProjectId) return;
    try {
      await api.post(`/projects/${activeProjectId}/stop`);
    } catch (err) {
      console.error("Failed to stop:", err);
    }
  };

  const goBackToDashboard = () => {
    setStep('intro');
    setIsPolling(false);
  };

  // NEW: Version Navigation Logic
  const handleVersionChange = (direction) => {
    if (!projectState?.versions) return;
    
    const totalVersions = projectState.versions.length;
    // Current version logic: 
    // If viewingVersion is null, we are at HEAD (which is effectively version total+1)
    // Version indices are 1-based for UI display
    
    let currentIdx = viewingVersion === null ? totalVersions + 1 : viewingVersion;
    let newIdx = currentIdx + direction;

    if (newIdx > totalVersions) {
      setViewingVersion(null); // Go back to HEAD
    } else if (newIdx >= 1) {
      setViewingVersion(newIdx);
    }
  };

  // Helper to get files based on version state
  const getViewFiles = () => {
    if (!projectState) return [];
    if (viewingVersion === null) return projectState.files || [];
    
    // Find specific version (adjust for 0-based array vs 1-based UI)
    // project.versions[0] is v1. 
    const ver = projectState.versions[viewingVersion - 1];
    return ver ? ver.files : [];
  };

  const activeFiles = getViewFiles();
  const activeLogs = projectState?.logs || [];
  
  // Determine status text
  let displayStatus = projectState?.status === 'completed' ? 'System Ready' : 'Architecting...';
  if (projectState?.status === 'stopped') displayStatus = 'Stopped';
  if (viewingVersion !== null) displayStatus = `Viewing v${viewingVersion}`;

  const [selectedFile, setSelectedFile] = useState(null);
  
  // Auto-select file when list changes (and none selected)
  useEffect(() => {
    if (activeFiles.length > 0) {
       // Try to keep current selection if it exists in new list
       const stillExists = activeFiles.find(f => f.path === selectedFile?.path);
       if (stillExists) setSelectedFile(stillExists);
       else setSelectedFile(activeFiles[0]);
    }
  }, [activeFiles]); // Depend on the computed files list

  // Determine Current UI Version Number for display
  const displayVersion = viewingVersion === null 
    ? (projectState?.versions?.length || 0) + 1 
    : viewingVersion;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');
        :root { --bg-primary: #050505; --text-primary: #ffffff; --text-secondary: rgba(255, 255, 255, 0.6); --border-color: rgba(255, 255, 255, 0.1); --glass-bg: rgba(0, 0, 0, 0.3); --accent: #808000; }
        html.light { --bg-primary: #ffffff; --text-primary: #000000; --text-secondary: #4a4a4a; --border-color: rgba(0, 0, 0, 0.15); --glass-bg: rgba(255, 255, 255, 0.85); --accent: #556b2f; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background-color: var(--bg-primary); color: var(--text-primary); transition: background-color 0.5s ease, color 0.5s ease; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-primary); }
        ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
      `}</style>

      <div className="overflow-x-hidden min-h-screen selection:bg-olive/20">
        <AnimatePresence>
          {(loading || authLoading) && <Preloader />}
        </AnimatePresence>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {user ? (
          <DashboardLayout 
            onNewProject={() => { setStep('intro'); setActiveProjectId(null); setProjectState(null); setViewingVersion(null); }}
            onLoadProject={loadExistingProject} 
          >
             <div className="p-0 h-full overflow-hidden flex flex-col">
                {step === 'intro' && (
                  <div className="flex-1 overflow-y-auto p-8">
                    <Hero 
                      prompt={prompt} 
                      setPrompt={setPrompt} 
                      handleFetchQuestions={startArchitectSession} 
                      isLoading={false}
                      userApiKey={apiKey} 
                      setUserApiKey={setApiKey}
                    />
                  </div>
                )}
                
                {/* Initial Configuration Step */}
                {step === 'dashboard' && (
                  <Questionnaire 
                     modules={generatedModules}
                     answers={config} 
                     setAnswers={setConfig} 
                     isLoading={false}
                     onSubmit={startGeneration}
                     onClose={() => setStep('intro')}
                  />
                )}

                {/* IDE View */}
                {(step === 'building' || step === 'done') && (
                  <>
                    <GeneratorInterface 
                      prompt={projectState?.originalPrompt || prompt} 
                      files={activeFiles} 
                      selectedFile={selectedFile} 
                      onSelect={setSelectedFile}
                      status={displayStatus}
                      animatedCode={selectedFile?.code || ''}
                      onDownload={downloadZip}
                      error={error}
                      logs={activeLogs}
                      projectId={activeProjectId}
                      onBack={goBackToDashboard}
                      onStop={handleStopGeneration}
                      onOpenSettings={() => setShowSettings(true)} // Open Settings
                      currentVersion={displayVersion} // Pass Version
                      onVersionChange={handleVersionChange} // Pass Handler
                    />

                    {/* Settings Overlay (Re-using Questionnaire) */}
                    <AnimatePresence>
                      {showSettings && (
                        <div className="fixed inset-0 z-[60]">
                           <Questionnaire 
                              modules={generatedModules.length > 0 ? generatedModules : []} // Use existing schema or fetch new if empty
                              answers={config} 
                              setAnswers={setConfig} 
                              isLoading={false}
                              onSubmit={handleUpdateProject} // Different submit handler for updates
                              onClose={() => setShowSettings(false)}
                           />
                        </div>
                      )}
                    </AnimatePresence>
                  </>
                )}
             </div>
          </DashboardLayout>
        ) : (
          <>
             <AnimatePresence>
               {showNav && <Navbar onLogin={() => setShowAuthModal(true)} />}
             </AnimatePresence>
             
             <Hero 
                prompt={prompt} 
                setPrompt={setPrompt} 
                handleFetchQuestions={() => setShowAuthModal(true)} 
                isLoading={false}
                userApiKey={apiKey} 
                setUserApiKey={setApiKey}
              />
              <Stats />
              <HowItWorks />
              <HowItWorks />
              <WhyChooseUs />
              <TechStack />
              <Testimonials />
              <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}