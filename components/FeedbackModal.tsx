
import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(false);
      setRating(null);
      setComment('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl animate-scale-in overflow-hidden border border-slate-100">
        
        {submitted ? (
          <div className="p-10 text-center bg-green-50">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                <i className="fa-solid fa-check"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
             <p className="text-slate-600">Your feedback helps us build a better hub.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <i className="fa-regular fa-comment-dots text-indigo-600"></i> Share Feedback
              </h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
               <div className="text-center">
                  <label className="block text-sm font-bold text-slate-700 mb-4">How is your experience?</label>
                  <div className="flex justify-center gap-3">
                     {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${rating && rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                           <i className="fa-solid fa-star"></i>
                        </button>
                     ))}
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Comments or Suggestions</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none h-32"
                    placeholder="Tell us what you love or what needs fixing..."
                    required
                  />
               </div>

               <button 
                 type="submit"
                 disabled={!rating}
                 className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Send Feedback
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
