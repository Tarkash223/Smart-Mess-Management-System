import React, { useState } from 'react';
import { Utensils, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';

function FooterSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h4 className="footer-section-heading text-sm font-semibold text-white">{title}</h4>
      <button
        type="button"
        className="footer-section-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`footer-section-content ${isOpen ? 'is-open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight">SMART MESS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's smart mess management & food demand forecasting platform for college hostels and university campuses.
            </p>
            <p className="text-emerald-400 text-[11px] font-semibold">
              Designed for Hostels across India 🇮🇳
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2">
            <FooterSection title="Platform Navigation">
              <ul className="space-y-1.5">
                <li><button onClick={() => setActivePage('home')} className="hover:text-emerald-400">Home</button></li>
                <li><button onClick={() => setActivePage('features')} className="hover:text-emerald-400">Platform Features</button></li>
                <li><button onClick={() => setActivePage('how-it-works')} className="hover:text-emerald-400">How It Works</button></li>
                <li><button onClick={() => setActivePage('solutions')} className="hover:text-emerald-400">Institutional Solutions</button></li>
                <li><button onClick={() => setActivePage('impact')} className="hover:text-emerald-400">Wastage Impact</button></li>
              </ul>
            </FooterSection>
          </div>

          {/* Col 3: Role Portals */}
          <div className="space-y-2">
            <FooterSection title="Role Access Portals">
              <ul className="space-y-1.5">
                <li><button onClick={() => setActivePage('about')} className="hover:text-emerald-400">About SMART MESS</button></li>
                <li><button onClick={() => setActivePage('contact')} className="hover:text-emerald-400">Request Institution Demo</button></li>
                <li><span className="text-slate-500">Student Portal</span></li>
                <li><span className="text-slate-500">Mess Manager Console</span></li>
                <li><span className="text-slate-500">Admin Control Center</span></li>
              </ul>
            </FooterSection>
          </div>

          {/* Col 4: Contact & Regional Sample */}
          <div className="space-y-2">
            <FooterSection title="Campus Headquarters">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sabour Campus, Bhagalpur, Bihar - 813210</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>contact@smartmess.in</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+91 612 2840 920</span>
                </p>
              </div>
            </FooterSection>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p className="w-full sm:w-auto text-center sm:text-left">© 2026 SMART MESS</p>
          <p className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1 text-center sm:text-left">
            Made for campus dining.
          </p>
        </div>

      </div>
    </footer>
  );
}
