
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] animate-fade-in">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-xl">
          <i className="fa-solid fa-bolt"></i>
        </div>
      </div>
      <p className="mt-6 text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">
        Initializing Module...
      </p>
    </div>
  );
};

export default LoadingScreen;
