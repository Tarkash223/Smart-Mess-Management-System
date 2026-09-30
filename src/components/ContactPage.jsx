import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, Factory, HandHeart, Layers, Leaf, ShoppingBag, Utensils } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    sector: 'Institutional kitchen',
    role: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10 animate-fadeIn">
      
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="badge badge-emerald font-bold">Platform enquiries</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact the Smart Food Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          Send an enquiry about institutional kitchens, catering, food businesses, processing operations, or surplus receiving.
        </p>
      </div>

      {/* 2-Column Balanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        
        {/* Left Column: Contact details and enquiry topics */}
        <div className="min-w-0 lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-6">
          
          {/* Card 1: Contact details */}
          <div className="card-clean p-4 sm:p-6 space-y-5 bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-sm flex-1">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contact details
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Platform office</span>
                  <span className="break-words text-slate-700 dark:text-slate-300 font-medium">Sabour Campus, Bhagalpur, Bihar - 813210</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Official Inquiries</span>
                  <span className="break-words text-slate-700 dark:text-slate-300 font-medium">contact@smartmess.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Phone</span>
                  <span className="break-words font-mono font-bold text-slate-800 dark:text-slate-200">+91 612 2840 920 / +91 94310 88291</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Supported enquiry areas */}
          <div className="card-clean p-4 sm:p-5 bg-emerald-50/70 dark:bg-slate-850 border border-emerald-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Enquiry areas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <Utensils className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">Institutional kitchens</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">Cafeterias and catering</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <ShoppingBag className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">Food businesses</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <Factory className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">Food processing units</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <HandHeart className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">NGOs and food receivers</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/80 dark:border-slate-750 shadow-2xs">
                <Leaf className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-slate-100">Platform and impact questions</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Form */}
        <div className="min-w-0 lg:col-span-7">
          <div className="card-clean p-4 sm:p-8 bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col justify-center">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Enquiry summary saved</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                    Thank you, <strong className="text-slate-900 dark:text-white font-bold">{formData.name}</strong>. Your enquiry for <strong className="text-slate-900 dark:text-white font-bold">{formData.sector}</strong> is shown here. This form is not connected to email or a request-management service, so no message has been sent.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-xs px-4 py-2 cursor-pointer font-bold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform enquiry</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Choose the operational area and describe what you need to discuss.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. S. K. Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-xs w-full font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Organization name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Organization or facility"
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      className="text-xs w-full font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Platform area *</label>
                    <select required value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="text-xs w-full font-medium">
                      <option>Institutional kitchen</option>
                      <option>Cafeterias and catering</option>
                      <option>Food businesses</option>
                      <option>Food processing units</option>
                      <option>NGOs, food banks, and shelters</option>
                      <option>Platform administration and impact</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Your role</label>
                    <input type="text" placeholder="e.g. Operations manager" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="text-xs w-full font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="verma@institution.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="text-xs w-full font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="text-xs w-full font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">What would you like to discuss? (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Share your current food planning, production, surplus, or redistribution needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="text-xs w-full leading-relaxed font-medium"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-sm py-3 cursor-pointer shadow-md font-bold mt-2">
                  <Send className="w-4 h-4" />
                  Review enquiry
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}


