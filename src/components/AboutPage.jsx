import React from 'react';
import { ArrowRight, Boxes, HandHeart, Leaf, ShieldCheck } from 'lucide-react';

export default function AboutPage({ onOpenLogin }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="badge badge-emerald">About the platform</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          One platform for food planning, operations, and recovery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Connect institutional kitchens, catering, food businesses, processing units, and community receivers through sector-specific workflows and a shared surplus network.
        </p>
      </div>

      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">How the modules connect</h2>
          <p className="mt-1 text-sm text-slate-600">Any eligible provider can share surplus directly with an appropriate receiver; food does not need to pass through every sector.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card-clean space-y-3 p-5"><Boxes className="h-5 w-5 text-emerald-700" /><h3 className="text-base font-bold text-slate-900">Sector-specific operations</h3><p className="text-xs leading-relaxed text-slate-600">Institutional teams manage attendance, menus, mess-offs, and meal outcomes. Catering teams plan events. Businesses forecast item sales and unsold food. Plants track batches, inputs, downtime, and storage.</p></article>
          <article className="card-clean space-y-3 p-5"><ShieldCheck className="h-5 w-5 text-emerald-700" /><h3 className="text-base font-bold text-slate-900">Safety before redistribution</h3><p className="text-xs leading-relaxed text-slate-600">Providers record preparation time, storage conditions, and quality checks. Human verification is required before food is offered; the platform does not automatically certify safety.</p></article>
          <article className="card-clean space-y-3 p-5"><HandHeart className="h-5 w-5 text-emerald-700" /><h3 className="text-base font-bold text-slate-900">Shared receiver network</h3><p className="text-xs leading-relaxed text-slate-600">NGOs, food banks, shelters, and community kitchens can review suitable listings, request food, coordinate pickup, and confirm what they received.</p></article>
          <article className="card-clean space-y-3 p-5"><Leaf className="h-5 w-5 text-emerald-700" /><h3 className="text-base font-bold text-slate-900">Evidence-led improvement</h3><p className="text-xs leading-relaxed text-slate-600">Planning and impact views use recorded activity. Forecasts are transparent baselines or historical heuristics; environmental estimates require a matching unit and a sourced factor.</p></article>
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Institutional Food Management remains the established core module; other sector workspaces extend the shared platform.</p>
        <button type="button" onClick={onOpenLogin} className="btn-primary justify-center text-sm">Explore platform workspaces <ArrowRight className="h-4 w-4" /></button>
      </section>
    </div>
  );
}
