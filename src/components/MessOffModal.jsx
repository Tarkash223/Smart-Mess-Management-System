import React, { useState } from 'react';
import { Calendar, X, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MessOffModal({ isOpen, onClose, onApplyMessOff }) {
  const [startDate, setStartDate] = useState('2026-09-29');
  const [endDate, setEndDate] = useState('2026-10-02');
  const [reason, setReason] = useState('Going home for festival / mid-term holiday');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 50
    });

    setTimeout(() => {
      if (onApplyMessOff) {
        onApplyMessOff({ startDate, endDate, reason });
      }
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-card border border-amber-500/30 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mess-Off Request</h3>
              <p className="text-xs text-amber-300 font-medium">Meal Skip / Holiday Leave</p>
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
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Mess-Off Request Approved!</h4>
            <div className="bg-amber-950/50 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-300 flex items-center gap-3 text-left">
              <Cpu className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <strong>AI Headcount Updated:</strong> Kitchen preparation forecast lowered by 4 meals for your requested dates. Food waste prevented!
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Submit mess-off before 10:00 PM for next day's meal count adjustment.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">From Date (आरंभ तिथि):</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">To Date (समाप्ति तिथि):</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Reason (कारण):</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Going home for festival / mid-term holiday">Going home for festival / holiday</option>
                <option value="Exam leave / Study prep">Exam leave / Study prep</option>
                <option value="Health / Medical mess skip">Health / Medical mess skip</option>
                <option value="Single meal skip (Lunch/Dinner only)">Single meal skip</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                Confirm Mess-Off
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
