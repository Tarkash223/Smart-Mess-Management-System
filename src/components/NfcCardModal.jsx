import React, { useState } from 'react';
import { SmartphoneNfc, X, CheckCircle, Wifi, ShieldCheck, QrCode, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NfcCardModal({ isOpen, onClose, student }) {
  const [scanning, setScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [lastTap, setLastTap] = useState("Today, 12:45 PM (Lunch Gate Entry)");

  if (!isOpen) return null;

  const handleSimulateTap = () => {
    setScanning(true);
    setScannedSuccess(false);

    setTimeout(() => {
      setScanning(false);
      setScannedSuccess(true);
      setLastTap(`Just now (${new Date().toLocaleTimeString()}) - Tap Verified ✅`);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card border border-emerald-500/30 overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900/40 via-emerald-900/30 to-slate-900 p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <SmartphoneNfc className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">NFC Smart Student Pass</h3>
              <p className="text-xs text-emerald-300 font-medium">RFID Tap-to-Eat Identification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Digital NFC Card Visual */}
          <div className="relative w-full aspect-[1.6/1] rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-800 border border-emerald-500/40 shadow-xl flex flex-col justify-between overflow-hidden group">
            
            {/* Background Smart Card Image Overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('/images/smart_card.png')` }}
            />

            {/* Glowing Accent Lines */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />

            {/* Card Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-emerald-400">SMART MESS PASS</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  RFID 13.56 MHz
                </span>
              </div>
              <Wifi className="w-6 h-6 text-emerald-400 animate-pulse rotate-90" />
            </div>

            {/* Card Body & Chip */}
            <div className="flex items-center gap-4 z-10 my-2">
              <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-300 to-amber-500 border border-amber-200/80 shadow-inner flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-700/40 rounded-sm" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-wide">{student.name}</h4>
                <p className="text-xs text-slate-300 font-mono">Roll: {student.rollNo} • {student.hostel}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-end justify-between z-10 pt-2 border-t border-slate-700/50">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">NFC TOKEN ID</p>
                <p className="text-xs text-emerald-300 font-mono font-semibold">{student.nfcToken}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">MEAL CREDITS</p>
                <p className="text-sm text-amber-400 font-bold">{student.balanceMeals} Meals Active</p>
              </div>
            </div>

          </div>

          {/* Interactive Gate Tap Simulator */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-300">
              Mess Entrance Terminal Simulator (मेस प्रवेश द्वार स्कैनर):
            </p>

            <button
              onClick={handleSimulateTap}
              disabled={scanning}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                scanning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : scannedSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30'
              }`}
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Scanning NFC Card...
                </>
              ) : scannedSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Entry Authorized! Enjoy Meal 🍽️
                </>
              ) : (
                <>
                  <SmartphoneNfc className="w-5 h-5" />
                  Tap Card to Scan at Gate
                </>
              )}
            </button>

            {/* Status log */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Last Gate Scan: <strong className="text-slate-200">{lastTap}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
