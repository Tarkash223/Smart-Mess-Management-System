import React, { useState } from 'react';
import { Star, X, CheckCircle2, Cpu, ThumbsUp, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RatingModal({ isOpen, onClose, mealName = "Wednesday Lunch (Authentic Litti Chokha Feast)", onSubmitRating }) {
  const [taste, setTaste] = useState(4);
  const [quality, setQuality] = useState(5);
  const [quantity, setQuantity] = useState(4);
  const [hygiene, setHygiene] = useState(5);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState(['Garam Litti', 'Shuddh Ghee', 'Swaad Badiya']);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const availableTags = [
    'Garam Litti 🫓', 'Shuddh Ghee 🥣', 'Swaad Badiya 👌', 
    'Namak Kam Thha 🧂', 'Mirchi Zyada 🌶️', 'Hygiene Best 🧼',
    'Portion Sufficient 🍽️', 'Next Time Phir Banao! 😋'
  ];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    const avgRating = ((taste + quality + quantity + hygiene) / 4).toFixed(1);
    
    setTimeout(() => {
      if (onSubmitRating) {
        onSubmitRating({
          mealName,
          taste,
          quality,
          quantity,
          hygiene,
          avgRating,
          comment,
          tags,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  const renderStars = (rating, setRating, label, icon) => (
    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>{icon}</span> {label}
        </span>
        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          {rating} / 5
        </span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-125"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-card border border-orange-500/30 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600/30 via-amber-600/20 to-slate-900 p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Meal Rating & AI Feedback</h3>
              <p className="text-xs text-orange-300 font-medium">{mealName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Dhanyawad! Rating Submitted!</h4>
            <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 max-w-md flex items-center gap-3 text-left">
              <Cpu className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <strong>AI Model Updated Live:</strong> Your rating has been fed directly into the Mess Manager's dynamic demand forecasting algorithm for the next menu cycle!
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRatingSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Live ML Input Callout */}
            <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3 text-xs text-amber-300">
              <Cpu className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>Unique Feature:</strong> AAPKI Rating direct ML Model me input banti hai! Isse agle hafte ka food quantity predict hoga.
              </span>
            </div>

            {/* 4 Factor Rating Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderStars(taste, setTaste, "Taste (स्वाद)", "👅")}
              {renderStars(quality, setQuality, "Quality (गुणवत्ता)", "✨")}
              {renderStars(quantity, setQuantity, "Quantity (मात्रा)", "🍲")}
              {renderStars(hygiene, setHygiene, "Hygiene (स्वच्छता)", "🧼")}
            </div>

            {/* Quick Tag Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Quick Tags / त्वरित राय:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      tags.includes(tag)
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/60 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Comment Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Feedback (Optional / विस्तृत सुझाव):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Khana kaisa laga? Koi kami ya badlav chahiye ho to zaroor batayein..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-orange-500 focus:outline-none min-h-[70px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs"
              >
                <ThumbsUp className="w-4 h-4" />
                Submit to AI Model & Manager
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
