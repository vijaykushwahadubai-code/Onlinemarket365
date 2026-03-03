
import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', '/'], description: 'Toggle this menu' },
  { keys: ['Ctrl', 'H'], description: 'Go to Home / Dashboard' },
  { keys: ['Ctrl', 'P'], description: 'Open Project Manager' },
  { keys: ['Ctrl', 'K'], description: 'Search / Tool Explorer' },
  { keys: ['Ctrl', 'S'], description: 'Social Media Hub' },
  { keys: ['Esc'], description: 'Close Modals' },
];

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl animate-scale-in overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <i className="fa-regular fa-keyboard text-indigo-600"></i> Keyboard Shortcuts
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div className="p-2">
          {SHORTCUTS.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, kIdx) => (
                  <kbd key={kIdx} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 shadow-sm min-w-[24px] text-center font-mono">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
           <p className="text-xs text-slate-400">Pro Tip: Shortcuts make you 3x faster.</p>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
