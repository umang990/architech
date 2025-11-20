import React, { useState, useEffect } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Components
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
import { AlertTriangle } from 'lucide-react';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Logic
import { fetchClarifyingQuestions, generateFileCode } from './services/aiService';
import { highlightCode } from './utils/highlight';

// --- Main Layout Wrapper to consume Theme ---
const AppLayout = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const { scrollY } = useScroll();

  // --- State ---
  const [step, setStep] = useState('intro'); 
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [config, setConfig] = useState({}); 
  const [generatedModules, setGeneratedModules] = useState([]);
  const [error, setError] = useState(null);

  // --- Gen State ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildStatus, setBuildStatus] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [animatedCode, setAnimatedCode] = useState('');

  // --- Effects ---
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

  // --- Handlers ---
  const startArchitectSession = async () => {
    if (!prompt) return;
    setIsGenerating(true);
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
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProject = async () => {
    setStep('building');
    setIsGenerating(true);
    try {
      setBuildStatus('Analyzing Blueprint...');
      const plannedFiles = [
        'server/server.js', 'server/package.json', 'server/config/db.js',
        'server/models/User.js', 'server/controllers/authController.js',
        'client/src/App.jsx', 'client/package.json', 'README.md'
      ];

      const generatedFiles = [];
      for (const path of plannedFiles) {
        setBuildStatus(`Architecting ${path}...`);
        const code = await generateFileCode(prompt, config, path);
        const newFile = { path, code };
        generatedFiles.push(newFile);
        setFiles([...generatedFiles]);
        setSelectedFile(newFile);
        const hl = highlightCode(code);
        setAnimatedCode(hl); 
        await new Promise(r => setTimeout(r, 100));
      }
      setBuildStatus('System Ready');
      setIsGenerating(false);
      setStep('done');
    } catch (e) {
      setError(e.message);
      setStep('intro');
    }
  };

  const downloadZip = () => {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.path, f.code));
    zip.generateAsync({type:'blob'}).then(c => saveAs(c, 'mern-project.zip'));
  };

  if (step === 'building' || step === 'done') {
    return (
      <GeneratorInterface 
        files={files} 
        selectedFile={selectedFile} 
        onSelect={(f) => {
           setSelectedFile(f);
           setAnimatedCode(highlightCode(f.code));
        }}
        status={buildStatus}
        animatedCode={animatedCode}
        onDownload={downloadZip}
        error={error}
      />
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');
        
        :root {
          --bg-primary: #050505;
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.6);
          --border-color: rgba(255, 255, 255, 0.1);
          --glass-bg: rgba(0, 0, 0, 0.3);
          --accent: #808000;
        }

        html.light {
          --bg-primary: #ffffff;
          --text-primary: #000000;
          --text-secondary: #4a4a4a;
          --border-color: rgba(0, 0, 0, 0.15);
          --glass-bg: rgba(255, 255, 255, 0.85);
          --accent: #556b2f;
        }

        html { scroll-behavior: smooth; }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.5s ease, color 0.5s ease;
        }
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-primary); }
        ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
      `}</style>

      <div className="overflow-x-hidden min-h-screen selection:bg-olive/20">
        <AnimatePresence>
          {loading && <Preloader />}
          {showNav && <Navbar />}
        </AnimatePresence>

        {step === 'dashboard' && (
          <Questionnaire 
             modules={generatedModules}
             answers={config} 
             setAnswers={setConfig} 
             isLoading={isGenerating}
             onSubmit={generateProject}
          />
        )}

        <Hero 
          prompt={prompt} 
          setPrompt={setPrompt} 
          handleFetchQuestions={startArchitectSession} 
          isLoading={isGenerating}
          userApiKey={apiKey} 
          setUserApiKey={setApiKey}
        />

        {error && (
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-6 py-3 rounded-full flex items-center gap-2 z-50 shadow-xl border border-red-500/50">
              <AlertTriangle size={18} />
              <span>{error}</span>
           </div>
        )}

        <Stats />
        <HowItWorks />
        <WhyChooseUs />
        <TechStack />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}