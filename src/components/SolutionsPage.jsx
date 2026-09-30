import React from 'react';
import { ArrowRight, Building2, Factory, HandHeart, School, ShoppingBag, Utensils } from 'lucide-react';

export default function SolutionsPage({ onOpenLogin }) {
  const solutions = [
    {
      role: "Institutional kitchens",
      icon: School,
      desc: "The existing module connects administration, mess managers, and students around meal planning and recorded outcomes.",
      points: ["Hostel, student, and mess management", "Participation, menus, feedback, and mess-offs", "Demand recommendations and prepared/consumed/waste records"]
    },
    {
      role: "Cafeterias & catering teams",
      icon: Utensils,
      desc: "Event-based planning uses expected guests and comparable completed event outcomes to guide preparation.",
      points: ["Events, venues, dates, guest counts, and menus", "Recommended item preparation and post-event actuals", "Feedback and safety-reviewed surplus handoff"]
    },
    {
      role: "Food businesses",
      icon: ShoppingBag,
      desc: "Item and service-period records support production planning without making billing or POS the focus.",
      points: ["Item forecasts from sales history or a manager baseline", "Prepared, sold, unsold, and wasted quantities", "Optional recipe-based ingredient estimates and surplus handoff"]
    },
    {
      role: "Food processing units",
      icon: Factory,
      desc: "Plant operators compare production plans with batch outcomes and configured storage operating ranges.",
      points: ["Raw-material variance, output, and downtime", "Energy and water readings when recorded", "Simulated sensor alerts and human-reviewed quality observations"]
    },
    {
      role: "NGOs, food banks, and shelters",
      icon: HandHeart,
      desc: "Receivers find appropriate, verified surplus and coordinate pickup or delivery with the provider.",
      points: ["Browse and filter by zone, food type, and quantity", "Request/accept offers and plan multi-stop pickups", "Confirm received quantity and review handoff history"]
    },
    {
      role: "Platform administration",
      icon: Building2,
      desc: "A shared control and reporting layer connects the operational sectors without merging their distinct workflows.",
      points: ["Platform-level role and sector access", "Cross-sector records with units kept distinct", "Receiver-confirmed redistribution and sourced impact estimates"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge badge-emerald">One connected platform</span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Solutions by Operational Sector
        </h1>
        <p className="text-sm text-slate-600">
          Each sector has its own workflow; verified surplus, receiver coordination, and impact reporting are shared across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {solutions.map((sol, i) => (
          <div key={i} className="card-clean p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <sol.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{sol.role}</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{sol.desc}</p>

            <ul className="space-y-2 border-t border-slate-100 pt-3">
              {sol.points.map((pt, j) => (
                <li key={j} className="text-xs text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button type="button" onClick={onOpenLogin} className="btn-primary justify-center text-sm">
          Open a platform workspace <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
