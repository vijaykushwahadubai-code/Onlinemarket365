
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/'; 
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center p-8 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl border border-red-100 rounded-[2.5rem] p-10 shadow-2xl max-w-lg w-full">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto shadow-sm border border-red-100">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">
              The application encountered an unexpected error.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 text-left max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Error Details:</p>
                <code className="text-xs text-red-600 font-mono break-all block">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleHome}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-house"></i> Home
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-right"></i> Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
