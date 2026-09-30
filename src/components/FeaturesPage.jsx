import React from 'react';
import { FEATURES_LIST } from '../data/mockData';
import { Activity, BarChart3, Boxes, Calendar, CheckCircle2, ClipboardCheck, ClipboardList, Eye, Factory, HandHeart, Layers, MapPin, ShieldCheck, ShoppingBag, Thermometer, TrendingDown, Utensils } from 'lucide-react';

export default function FeaturesPage() {
  const iconMap = {
    Activity: Activity,
    BarChart3: BarChart3,
    Boxes: Boxes,
    Calendar: Calendar,
    ClipboardCheck: ClipboardCheck,
    ClipboardList: ClipboardList,
    Eye: Eye,
    Factory: Factory,
    HandHeart: HandHeart,
    Layers: Layers,
    MapPin: MapPin,
    ShieldCheck: ShieldCheck,
    ShoppingBag: ShoppingBag,
    Thermometer: Thermometer,
    TrendingDown: TrendingDown,
    Utensils: Utensils
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge badge-emerald">Current Platform Capabilities</span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Food Management & Redistribution
        </h1>
        <p className="text-sm text-slate-600">
          One platform connects institutional meals, catering events, food businesses, processing operations, and surplus receivers.
        </p>
      </div>

      {/* Current feature catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES_LIST.map((feat) => {
          const IconComp = iconMap[feat.icon] || Utensils;
          return (
            <div key={feat.id} className="card-clean p-6 space-y-3 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="badge badge-emerald text-[11px] font-semibold">{feat.badge}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{feat.sector}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Included
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
