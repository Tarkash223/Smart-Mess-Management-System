import React, { useState } from 'react';
import { Shield, Utensils, User, ShoppingBag, Factory, BarChart3, CheckCircle2, KeyRound } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('rahul.kumar@bit.ac.in');
  const [password, setPassword] = useState('••••••••');
  const [institution, setInstitution] = useState('Bihar Institute of Technology, Sabour');

  const roleCredentials = {
    student: {
      email: 'rahul.kumar@bit.ac.in',
      name: 'Rahul Kumar',
      detail: 'Hostel 1 (Buddha Block), Room 304',
      badge: 'Student Portal'
    },
    manager: {
      email: 'manager.mess1@bit.ac.in',
      name: 'Mr. Rajesh Sharma',
      detail: 'Mess Manager (Central Mess Unit A)',
      badge: 'Mess Manager Console'
    },
    admin: {
      email: 'admin.verma@bit.ac.in',
      name: 'Dr. S. K. Verma',
      detail: 'Chief Warden & Campus Administrator',
      badge: 'Administrative Control'
    },
    receiver: {
      email: 'coordinator@bhagalpurkitchen.org',
      name: 'Bhagalpur Community Kitchen',
      detail: 'Community food receiver · Sabour and Bhagalpur',
      badge: 'NGO / Receiver Portal',
      receiverId: 'bhagalpur-community-kitchen'
    },
    catering: {
      email: 'events@smartcatering.demo',
      name: 'Smart Catering Demo',
      detail: 'Catering Manager · Event food operations',
      badge: 'Cafeteria & Catering'
    },
    business: {
      email: 'manager@smartbites.demo',
      name: 'Smart Bites Demo',
      detail: 'Business Manager · Sales and food production planning',
      badge: 'Food Business'
    },
    processing: {
      email: 'plant.manager@smartfoods.demo',
      name: 'Smart Foods Demo Plant',
      detail: 'Plant Manager · Production, materials, machines, and storage',
      badge: 'Food Processing Unit'
    },
    platformAdmin: {
      email: 'platform.admin@smartfood.demo',
      name: 'Smart Food Platform Admin',
      detail: 'Cross-sector analytics · Verified network impact',
      badge: 'Platform Admin'
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(roleCredentials[role].email);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const activeInfo = roleCredentials[selectedRole];
    onLoginSuccess({
      role: selectedRole,
      name: activeInfo.name,
      email: email,
      detail: activeInfo.detail,
      institution: institution,
      receiverId: activeInfo.receiverId
    });
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 animate-fadeIn">
      
      <div className="card-clean p-8 space-y-6 bg-white border border-slate-200 shadow-md rounded-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Smart Food Platform Login</h2>
          <p className="text-xs text-slate-500">
            Secure Role-Based Authentication Gateway
          </p>
        </div>

        {/* Role Authentication Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">Select Account Role (खाता भूमिका चुनें):</label>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'student' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('manager')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'manager' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Mess Manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'admin' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Institute Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('receiver')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'receiver'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>NGO / Receiver</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('catering')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'catering'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Catering Manager</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('business')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                selectedRole === 'business'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Food Business</span>
            </button>

            <div className="col-span-2 flex justify-center gap-2 sm:col-span-3">
              <button
                type="button"
                onClick={() => handleRoleSelect('processing')}
                className={`w-full max-w-[8.75rem] py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  selectedRole === 'processing'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Factory className="w-4 h-4 text-emerald-600" />
                <span>Plant Manager</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('platformAdmin')}
                className={`w-full max-w-[8.75rem] py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  selectedRole === 'platformAdmin'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Platform Admin</span>
              </button>
            </div>

          </div>
        </div>

        {/* Selected Role Context Box */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{roleCredentials[selectedRole].name}</span>
            <span className="badge badge-emerald text-[10px]">{roleCredentials[selectedRole].badge}</span>
          </div>
          <p className="text-[11px] text-slate-500">{roleCredentials[selectedRole].detail}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Campus Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">User Email / Roll Number</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs"
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center text-sm py-2.5 mt-2">
            <KeyRound className="w-4 h-4" />
            Login
          </button>

        </form>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Role-based portal authentication active</span>
        </div>

      </div>

    </div>
  );
}
