import React from 'react';
import { Activity, ArrowRight, BarChart3, Boxes, Calendar, CheckCircle2, ClipboardCheck, ClipboardList, Eye, Factory, HandHeart, Layers, MapPin, ShieldCheck, ShoppingBag, Thermometer, TrendingDown, Utensils } from 'lucide-react';
import { FEATURES_LIST } from '../data/mockData';

export default function HomePage({ setActivePage, onOpenLogin }) {
  const featureIconMap = {
    Activity, BarChart3, Boxes, Calendar, ClipboardCheck, ClipboardList, Eye, Factory,
    HandHeart, Layers, MapPin, ShieldCheck, ShoppingBag, Thermometer, TrendingDown, Utensils
  };

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Unified Food Operations & Redistribution Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Plan food across sectors. <br />
                <span className="text-emerald-600">Track surplus through recovery.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Connect institutional meals, catering events, food businesses, processing batches, and community receivers through shared planning and surplus workflows.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={onOpenLogin}
                  className="btn-primary text-sm px-6 py-3 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setActivePage('features')}
                  className="btn-secondary text-sm px-6 py-3 cursor-pointer"
                >
                  Explore Platform Capabilities
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Five connected operational sectors
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Demand and production planning
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Safety-reviewed surplus handoff
                </span>
              </div>

            </div>

            {/* Right Visual Hero Preview */}
            <div className="lg:col-span-5 relative">
              <div className="card-clean p-3 shadow-xl border-slate-200 bg-white relative z-10 overflow-hidden">
                <img 
                  src="/images/hero_dining.png" 
                  alt="Hostel Mess Dining Hall"
                  className="w-full h-56 object-cover rounded-xl mb-3"
                />

                {/* Dashboard snippet overlay */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Food operations workspace</span>
                      <span className="text-[11px] text-slate-500">Sector workflows · Shared surplus network</span>
                    </div>
                    <span className="badge badge-emerald">Five sectors</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Plan</span>
                      <span className="text-sm font-bold text-slate-900">Forecast</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Monitor</span>
                      <span className="text-sm font-bold text-emerald-600">Actuals</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-medium">Recover</span>
                      <span className="text-sm font-bold text-emerald-700">Surplus</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM PRINCIPLES */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">5 sectors</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">One connected platform</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600">Plan</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Demand and production</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">Verify</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Quality before listing</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600">Recover</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Match surplus to receivers</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED HIGHLIGHTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge badge-emerald">Current Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Features across the five sectors
          </h2>
          <p className="text-sm text-slate-600">
            Sector-specific workflows share demand planning, verified surplus, receiver coordination, and impact reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURES_LIST.map((feat) => {
            const IconComp = featureIconMap[feat.icon] || Utensils;
            return <div key={feat.id} className="card-clean p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="badge badge-emerald text-[10px] font-semibold">{feat.badge}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>{feat.sector}</span>
              </div>
            </div>;
          })}
        </div>
      </section>

      {/* SHARED FOOD RECOVERY WORKFLOW */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="badge bg-emerald-950 text-emerald-400 border border-emerald-800">
              Shared operational flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              From demand planning to verified recovery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each sector contributes its own records to a shared surplus and redistribution workflow.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="bg-slate-800/80 p-4 sm:p-6 rounded-2xl border border-slate-700 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 font-semibold text-slate-300 flex items-center justify-center">
                Attendance, orders & guest counts
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 font-semibold text-slate-300 flex items-center justify-center">
                Production and batch plans
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 font-semibold text-slate-300 flex items-center justify-center">
                Demand and prep recommendations
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 font-semibold text-slate-300 flex items-center justify-center">
                Actual consumption and sales
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 font-semibold text-slate-300 col-span-2 sm:col-span-1 flex items-center justify-center">
                Surplus and waste records
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-xl">↓</div>

            {/* Result Box */}
            <div className="card-primary-highlight p-4 sm:p-6 max-w-xl mx-auto text-slate-900 text-center space-y-4 w-full">
              <h3 className="text-base font-bold">Common surplus redistribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 block mb-0.5 font-medium">Provider review</span>
                  <span className="text-base font-extrabold text-slate-900">Safety and quality</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 block mb-0.5 font-medium">Receiver matching</span>
                  <span className="text-base font-extrabold text-emerald-600">Zone, type, capacity</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 block mb-0.5 font-medium">Handoff</span>
                  <span className="text-base font-extrabold text-emerald-700">Pickup to confirmation</span>
                </div>
              </div>
              <p className="text-xs text-emerald-800 font-semibold leading-relaxed px-2">
                Each eligible food source can connect directly to the network. Safety review is required before a listing can be shared.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
