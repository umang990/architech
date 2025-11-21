import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-8">
          <div className="max-w-2xl w-full bg-red-900/20 border border-red-500/50 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-serif">System Malfunction</h1>
                <p className="text-white/60 text-sm">The application encountered a critical error.</p>
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-red-200 overflow-auto max-h-64 mb-6">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black font-sans text-xs uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors"
            >
              Reload System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;