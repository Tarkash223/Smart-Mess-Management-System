import React from 'react';
import { Activity, BarChart3, Building, ClipboardCheck, Database, HandHeart, MapPin, ShieldCheck } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Capture sector operations",
      desc: "Institutional kitchens record meal participation; caterers enter events and guest counts; food businesses record item sales; plants plan production batches.",
      icon: Building
    },
    {
      step: "02",
      title: "Estimate demand and production",
      desc: "Each sector uses its own inputs: attendance and mess-offs, event details, item sales history, or planned batch requirements.",
      icon: BarChart3
    },
    {
      step: "03",
      title: "Review recommendations",
      desc: "Managers see predicted demand, preparation quantities, ingredient estimates, or production variance with the basis shown where available.",
      icon: Database
    },
    {
      step: "04",
      title: "Record actual outcomes",
      desc: "Capture prepared or produced quantity, consumed or sold quantity, remaining food, waste, material use, machine downtime, and feedback.",
      icon: ClipboardCheck
    },
    {
      step: "05",
      title: "Verify surplus before sharing",
      desc: "A provider records food details, time, storage conditions, and human safety and quality checks before a surplus listing becomes available.",
      icon: ShieldCheck
    },
    {
      step: "06",
      title: "Match and coordinate a receiver",
      desc: "Eligible receivers are suggested by service area, food category, quantity capacity, and availability. People confirm requests and handoff details.",
      icon: MapPin
    },
    {
      step: "07",
      title: "Confirm and learn from records",
      desc: "The receiver confirms what arrived. Sector analytics compare planned and actual records to inform future operational decisions.",
      icon: Activity
    },
    {
      step: "08",
      title: "Record completed recovery",
      desc: "Completed handoffs contribute receiver-confirmed quantities and unit-aware platform impact reporting.",
      icon: HandHeart
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="badge badge-emerald">Shared operational workflow</span>
        <h1 className="text-3xl font-extrabold text-slate-900">How the Food Platform Works</h1>
        <p className="text-sm text-slate-600">
          Sector-specific operations connect to one shared safety-reviewed surplus and redistribution network. Food can enter from any eligible source; it does not pass through every sector.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((item, idx) => (
          <div key={idx} className="card-clean p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0">
              {item.step}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2"><item.icon className="h-4 w-4 text-emerald-700" />
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
