import React, { useState } from 'react';
import { 
  Building, Utensils, Users, Shield, Bell, MessageSquare, ChevronDown, LogOut,
  Calendar, PieChart, Settings, Home, BarChart3, Plus, ArrowRight, FileText, CreditCard, DollarSign, CheckCircle2, Download, User, ShieldCheck, Edit3, Lock, AlertTriangle, Trash2, Megaphone, X
} from 'lucide-react';
import { HOSTELS_LIST, COMPLAINTS_DATA, NOTICES } from '../data/mockData';

export default function AdminPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [billingGenerated, setBillingGenerated] = useState(false);
  
  // Hostels State (Functional registration)
  const [hostelsList, setHostelsList] = useState(HOSTELS_LIST);
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [newHostelName, setNewHostelName] = useState('');
  const [newHostelCampus, setNewHostelCampus] = useState('Sabour Main Campus');
  const [newHostelWarden, setNewHostelWarden] = useState('');
  const [newHostelMessUnit, setNewHostelMessUnit] = useState('Sabour Central Mess A');
  const [newHostelCapacity, setNewHostelCapacity] = useState('450');
  const [hostelSuccessMsg, setHostelSuccessMsg] = useState('');

  // Campus Notices & Broadcast Announcements State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeTarget, setNoticeTarget] = useState('All Campuses & Hostels');
  const [noticeCategory, setNoticeCategory] = useState('Operational Notice');
  const [noticePosted, setNoticePosted] = useState(false);
  const [campusNoticesList, setCampusNoticesList] = useState([
    {
      id: 1,
      title: "Mid-Term Examination Extended Mess Shift",
      content: "Mess halls will provide midnight tea, hot milk, and biscuits from 11:30 PM to 01:00 AM across all campus hostels during exams.",
      category: "Exam Special",
      target: "All Hostels (1,840 Students)",
      date: "Today, 10:30 AM"
    },
    {
      id: 2,
      title: "Sunday Special Feast Voting Open",
      content: "Polls for next Sunday's special lunch are now live on student dashboards. Cast your votes before Friday 10 PM.",
      category: "Special Feast",
      target: "Buddha & Aryabhatta Blocks",
      date: "Yesterday, 3:15 PM"
    },
    {
      id: 3,
      title: "Monthly Mess Bill Calculation Finalized",
      content: "All attendance records and mess-off leaves for the month have been locked. Verified invoices are available in student wallets.",
      category: "Billing Notice",
      target: "All Campuses & Hostels",
      date: "26 Sept, 8:00 AM"
    }
  ]);
  
  // Student Directory Search State
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  // Event Mess-Off State
  const [eventTitle, setEventTitle] = useState('Diwali & Chhath Puja Break');
  const [eventStartDate, setEventStartDate] = useState('2026-11-01');
  const [eventEndDate, setEventEndDate] = useState('2026-11-08');
  const [eventCreated, setEventCreated] = useState(false);

  const handleGenerateMonthlyBilling = () => {
    setBillingGenerated(true);
    setTimeout(() => setBillingGenerated(false), 3500);
  };

  const handleAddHostel = (e) => {
    e.preventDefault();
    if (!newHostelName.trim() || !newHostelWarden.trim()) return;
    const newHostel = {
      id: hostelsList.length + 1,
      name: newHostelName,
      campus: newHostelCampus,
      students: Number(newHostelCapacity) || 400,
      warden: newHostelWarden,
      messUnit: newHostelMessUnit
    };
    setHostelsList([newHostel, ...hostelsList]);
    setHostelSuccessMsg(`New hostel block "${newHostelName}" registered successfully!`);
    setNewHostelName('');
    setNewHostelWarden('');
    setNewHostelCapacity('450');
    setShowAddHostelModal(false);
    setTimeout(() => setHostelSuccessMsg(''), 4000);
  };

  const handleDeleteHostel = (id) => {
    setHostelsList(hostelsList.filter(h => h.id !== id));
  };

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    const newNotice = {
      id: campusNoticesList.length + 1,
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      target: noticeTarget,
      date: 'Just now'
    };
    setCampusNoticesList([newNotice, ...campusNoticesList]);
    setNoticePosted(true);
    setNoticeTitle('');
    setNoticeContent('');
    setTimeout(() => setNoticePosted(false), 3000);
  };

  const handleDeleteNotice = (id) => {
    setCampusNoticesList(campusNoticesList.filter(n => n.id !== id));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEventCreated(true);
    setTimeout(() => setEventCreated(false), 3500);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'billing-engine', label: 'Automated Billing Engine', icon: CreditCard },
    { id: 'financial-audit', label: 'Transparent Financial Audit', icon: PieChart },
    { id: 'hostels', label: 'Multi-Hostel Blocks', icon: Building },
    { id: 'mess-units', label: 'Mess Units Allocation', icon: Utensils },
    { id: 'students', label: 'Student Directory & NFC', icon: Users },
    { id: 'managers', label: 'Mess Manager Audit', icon: Shield },
    { id: 'notices', label: 'Broadcast Campus Notices', icon: Bell },
    { id: 'complaints', label: 'Student Complaints Desk', icon: MessageSquare },
    { id: 'events', label: 'Exam & Event Mess-Off', icon: Calendar },
    { id: 'profile', label: 'Admin Profile', icon: User }
  ];

  const messUnitsList = [
    { name: 'Sabour Central Mess A', hostel: 'Buddha Hostel', manager: 'Rajesh Verma', capacity: 500, hygiene: '4.9/5 (Grade A+)', status: 'Active ✅' },
    { name: 'Sabour Central Mess B', hostel: 'Aryabhatta Block', manager: 'Suresh Kumar', capacity: 450, hygiene: '4.8/5 (Grade A+)', status: 'Active ✅' },
    { name: 'Patna Campus Dining', hostel: 'Nalanda Hall', manager: 'Amitabh Sen', capacity: 600, hygiene: '4.7/5 (Grade A)', status: 'Active ✅' },
    { name: 'Gaya Girls Mess', hostel: 'Gargi Girls Hostel', manager: 'Sunita Sharma', capacity: 400, hygiene: '5.0/5 (Grade A+)', status: 'Active ✅' }
  ];

  const studentDirectory = [
    { name: 'Rahul Kumar', roll: '2023-CS-042', hostel: 'Buddha Hostel', room: '204', nfcId: 'NFC-9982-A4', status: 'Active', dues: 'Clear' },
    { name: 'Priya Sharma', roll: '2023-EE-018', hostel: 'Gargi Girls Hostel', room: '108', nfcId: 'NFC-4431-B2', status: 'Active', dues: 'Clear' },
    { name: 'Amit Roy', roll: '2023-ME-088', hostel: 'Aryabhatta Block', room: '312', nfcId: 'NFC-1102-C9', status: 'Active', dues: '₹480 Pending' },
    { name: 'Vikram Singh', roll: '2024-CS-012', hostel: 'Nalanda Hall', room: '405', nfcId: 'NFC-7718-D3', status: 'Active', dues: 'Clear' }
  ];

  const managerAuditList = [
    { name: 'Rajesh Verma', unit: 'Sabour Central Mess A', wasteDrop: '30% Drop', auditScore: '98%', status: 'Compliant' },
    { name: 'Suresh Kumar', unit: 'Sabour Central Mess B', wasteDrop: '25% Drop', auditScore: '95%', status: 'Compliant' },
    { name: 'Amitabh Sen', unit: 'Patna Campus Dining', wasteDrop: '28% Drop', auditScore: '96%', status: 'Compliant' },
    { name: 'Sunita Sharma', unit: 'Gaya Girls Mess', wasteDrop: '32% Drop', auditScore: '99%', status: 'Top Rated ⭐' }
  ];

  const filteredStudents = studentDirectory.filter(s => 
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || 
    s.roll.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const adminOverview = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
      <div>
        <span className="text-xs text-emerald-400 font-semibold block">Institutional Governance</span>
        <h2 className="text-xl font-bold">Campus Hostels & Financial Audit Hub</h2>
        <p className="text-xs text-slate-300 mt-1">4 Hostel Blocks • 1,840 Enrolled Students</p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleGenerateMonthlyBilling}
          className="btn-primary text-xs py-2 cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Run Monthly Invoicing Engine
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden portal-container">
      
      {/* Sidebar — horizontal scrollable on mobile, vertical column on md+ */}
      <aside className="portal-sidebar shrink-0">
        <div className="sidebar-brand px-3 py-2 border-b border-slate-200 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Admin Control Panel</span>
          <h3 className="text-sm font-bold text-slate-900">Bihar Institute Campus</h3>
          <p className="text-[11px] text-slate-500 font-medium">Sabour Main Institution</p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="admin-mobile-overview">{adminOverview}</div>
        )}

        <button
          type="button"
          className="portal-feature-toggle"
          aria-expanded={featuresOpen}
          aria-controls="admin-portal-navigation"
          onClick={() => setFeaturesOpen((open) => !open)}
        >
          <span>Features</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
        </button>

        <nav id="admin-portal-navigation" className={`space-y-1 portal-navigation ${featuresOpen ? 'is-open' : ''}`}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setFeaturesOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="portal-role-logout">
          <button type="button" onClick={onLogout} className="w-full btn-secondary justify-center text-xs py-2">
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto min-w-0">
        
        {/* DASHBOARD HOME */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="admin-desktop-overview">{adminOverview}</div>

            {billingGenerated && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>September 2026 Monthly Invoices generated for 1,840 students across 4 hostels! WhatsApp notifications queued.</span>
              </div>
            )}

            {/* Metrics Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block font-medium">Total Hostels</span>
                <span className="text-2xl font-extrabold text-slate-900">4 Blocks</span>
                <span className="text-[11px] text-slate-400 block mt-1">Sabour, Patna, Gaya</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block font-medium">Active Messes</span>
                <span className="text-2xl font-extrabold text-slate-900">4 Units</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">100% Operational</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block font-medium">Total Students</span>
                <span className="text-2xl font-extrabold text-slate-900">1,840</span>
                <span className="text-[11px] text-slate-400 block mt-1">NFC Passes Active</span>
              </div>

              <div className="card-clean p-4 border-emerald-300 bg-emerald-50/20">
                <span className="text-xs text-slate-500 block font-medium">Monthly Food Waste</span>
                <span className="text-2xl font-extrabold text-emerald-700">1,420 KG</span>
                <span className="text-[11px] text-emerald-800 font-bold block mt-1">₹1.18 Lakh Saved</span>
              </div>
            </div>

            {/* Hostel List Summary */}
            <div className="card-clean p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Hostels & Assigned Mess Units</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Hostel Name</th>
                      <th className="p-3">Campus Location</th>
                      <th className="p-3">Warden</th>
                      <th className="p-3">Students</th>
                      <th className="p-3">Mess Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {HOSTELS_LIST.map((h) => (
                      <tr key={h.id}>
                        <td className="p-3 font-bold">{h.name}</td>
                        <td className="p-3">{h.campus}</td>
                        <td className="p-3">{h.warden}</td>
                        <td className="p-3 font-mono font-semibold">{h.students}</td>
                        <td className="p-3 text-emerald-700 font-semibold">{h.messUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* AUTOMATED BILLING ENGINE TAB */}
        {activeTab === 'billing-engine' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Automated Monthly Billing Engine</h3>
              <p className="text-xs text-slate-600">Auto-calculate monthly student cards, meal subscriptions, and extra plate fees in 1-click.</p>
            </div>

            <div className="card-clean p-6 space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-900">September 2026 Monthly Invoicing Run</h4>
              <p className="text-xs text-slate-600">Attendance records verified: 104,200 total meals served across 4 hostels.</p>
              
              {billingGenerated && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold">
                  ✓ Invoices generated & WhatsApp reminder alerts queued for 1,840 students!
                </div>
              )}

              <button onClick={handleGenerateMonthlyBilling} className="btn-primary text-xs py-2.5 cursor-pointer">
                <CreditCard className="w-4 h-4" /> Run 1-Click Monthly Billing & Send WhatsApp Alerts
              </button>
            </div>
          </div>
        )}

        {/* TRANSPARENT FINANCIAL AUDIT TAB */}
        {activeTab === 'financial-audit' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Transparent Financial Auditing & Ledgers</h3>
                <p className="text-xs text-slate-600">Track subscription purchases, cash collections, and grocery expenses.</p>
              </div>
              <button className="btn-secondary text-xs flex items-center justify-center gap-1.5 cursor-pointer self-center sm:self-auto">
                <Download className="w-3.5 h-3.5 text-emerald-700" /> Export Balance Sheet (PDF)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Total Monthly Revenues</span>
                <span className="text-xl font-extrabold text-slate-900">₹42,68,000</span>
              </div>
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Total Grocery & Fuel Expenses</span>
                <span className="text-xl font-extrabold text-slate-900">₹28,40,000</span>
              </div>
              <div className="card-clean p-4 border-emerald-300 bg-emerald-50/30">
                <span className="text-xs text-emerald-800 font-semibold block">Net Operating Profit</span>
                <span className="text-xl font-extrabold text-emerald-700">₹14,28,000</span>
              </div>
            </div>
          </div>
        )}

        {/* MULTI-HOSTEL BLOCKS TAB */}
        {activeTab === 'hostels' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Multi-Hostel Blocks Oversight</h3>
                <p className="text-xs text-slate-600">Manage residential hostel blocks and assigned dining facilities across Bihar campuses.</p>
              </div>
              <button 
                onClick={() => setShowAddHostelModal(true)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Register New Hostel Block
              </button>
            </div>

            {/* Success notification */}
            {hostelSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {hostelSuccessMsg}
              </div>
            )}

            {/* Register New Hostel Form (Modal / Collapsible) */}
            {showAddHostelModal && (
              <div className="card-clean p-6 bg-slate-50 border-2 border-emerald-500/40 space-y-4 animate-scaleUp shadow-md">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">Register New Residential Hostel Block</h4>
                  </div>
                  <button 
                    onClick={() => setShowAddHostelModal(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddHostel} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Hostel Block Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Chanakya Boys Hostel" 
                        value={newHostelName}
                        onChange={(e) => setNewHostelName(e.target.value)}
                        required
                        className="text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Campus Location *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sabour East Campus" 
                        value={newHostelCampus}
                        onChange={(e) => setNewHostelCampus(e.target.value)}
                        required
                        className="text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Chief Warden Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dr. P.K. Mishra" 
                        value={newHostelWarden}
                        onChange={(e) => setNewHostelWarden(e.target.value)}
                        required
                        className="text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Assigned Dining Mess</label>
                      <select 
                        value={newHostelMessUnit}
                        onChange={(e) => setNewHostelMessUnit(e.target.value)}
                        className="text-xs bg-white"
                      >
                        <option value="Sabour Central Mess A">Sabour Central Mess A</option>
                        <option value="Sabour Central Mess B">Sabour Central Mess B</option>
                        <option value="Patna Campus Dining">Patna Campus Dining</option>
                        <option value="Gaya Girls Mess">Gaya Girls Mess</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Student Resident Capacity</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 450" 
                        value={newHostelCapacity}
                        onChange={(e) => setNewHostelCapacity(e.target.value)}
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button 
                      type="button" 
                      onClick={() => setShowAddHostelModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary text-xs py-1.5 px-4 cursor-pointer"
                    >
                      Register Hostel Block
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Hostels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hostelsList.map((h) => (
                <div key={h.id} className="card-clean p-5 space-y-3 hover:border-slate-300 transition-all shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-emerald-600" />
                        {h.name}
                      </h4>
                      <p className="text-xs text-slate-500">{h.campus}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-emerald text-xs">{h.students} Residents</span>
                      {h.id > 4 && (
                        <button
                          onClick={() => handleDeleteHostel(h.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded cursor-pointer"
                          title="Delete hostel block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p><strong>Chief Warden:</strong> {h.warden}</p>
                    <p><strong>Assigned Dining:</strong> {h.messUnit}</p>
                    <p><strong>Occupancy Status:</strong> <span className="text-emerald-700 font-bold">96% Active</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESS UNITS ALLOCATION TAB */}
        {activeTab === 'mess-units' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Mess Units Allocation & Vendors</h3>
              <p className="text-xs text-slate-600">Central mess facility allocations, catering vendor contracts, and hygiene compliance.</p>
            </div>

            <div className="card-clean p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Active Campus Mess Facilities</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Mess Unit Name</th>
                      <th className="p-3">Mapped Hostel</th>
                      <th className="p-3">Manager In-Charge</th>
                      <th className="p-3">Capacity</th>
                      <th className="p-3">Hygiene Rating</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {messUnitsList.map((m, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{m.name}</td>
                        <td className="p-3 text-slate-600">{m.hostel}</td>
                        <td className="p-3 text-slate-800">{m.manager}</td>
                        <td className="p-3 font-mono font-semibold">{m.capacity} Diners</td>
                        <td className="p-3 font-semibold text-emerald-700">{m.hygiene}</td>
                        <td className="p-3 text-emerald-700 font-bold">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DIRECTORY & NFC TAB */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Resident Directory & NFC Tokens</h3>
                <p className="text-xs text-slate-600">Search 1,840 enrolled residents, issue smart NFC cards, or check fee status.</p>
              </div>
              <input 
                type="text" 
                placeholder="Search student or roll no..." 
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="text-xs max-w-xs"
              />
            </div>

            <div className="card-clean p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Resident Name</th>
                      <th className="p-3">Roll Number</th>
                      <th className="p-3">Hostel Block</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">NFC Token ID</th>
                      <th className="p-3">Dues Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredStudents.map((st, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{st.name}</td>
                        <td className="p-3 font-mono text-slate-500">{st.roll}</td>
                        <td className="p-3 text-slate-700">{st.hostel}</td>
                        <td className="p-3 font-mono">{st.room}</td>
                        <td className="p-3 font-mono font-semibold text-emerald-700">{st.nfcId}</td>
                        <td className={`p-3 font-bold ${st.dues === 'Clear' ? 'text-emerald-700' : 'text-red-600'}`}>{st.dues}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MESS MANAGER AUDIT TAB */}
        {activeTab === 'managers' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Mess Manager Performance & Food Waste Audit</h3>
              <p className="text-xs text-slate-600">Audit scores, waste reduction metrics, and hygiene logs across catering staff.</p>
            </div>

            <div className="card-clean p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Manager Name</th>
                      <th className="p-3">Assigned Mess Facility</th>
                      <th className="p-3">Food Waste Drop</th>
                      <th className="p-3">SLA Audit Score</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {managerAuditList.map((m, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{m.name}</td>
                        <td className="p-3 text-slate-600">{m.unit}</td>
                        <td className="p-3 font-semibold text-emerald-700">{m.wasteDrop}</td>
                        <td className="p-3 font-extrabold text-slate-900">{m.auditScore}</td>
                        <td className="p-3 text-emerald-700 font-bold">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BROADCAST CAMPUS NOTICES TAB */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Broadcast Campus Announcements</h3>
                <p className="text-xs text-slate-600">Publish institutional notices, special feast announcements, or emergency alerts across all hostels.</p>
              </div>
              <span className="badge badge-emerald self-start sm:self-auto py-1 px-2.5 text-xs font-semibold">
                Central Board Authority ✓
              </span>
            </div>

            {noticePosted && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Notice broadcasted successfully to <strong>{noticeTarget}</strong>! Pushed to all resident dashboards & notification drawers.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Compose Notice Form (5 Cols) */}
              <div className="lg:col-span-5 card-clean p-5 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Publish Campus Announcement</h4>
                    <p className="text-[11px] text-slate-500">Official institutional broadcast</p>
                  </div>
                </div>

                <form onSubmit={handlePostNotice} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Notice Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mid-Term Exam Night Tea Service" 
                      value={noticeTitle} 
                      onChange={(e) => setNoticeTitle(e.target.value)} 
                      required
                      className="text-xs" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Category</label>
                      <select
                        value={noticeCategory}
                        onChange={(e) => setNoticeCategory(e.target.value)}
                        className="text-xs"
                      >
                        <option value="Operational Notice">Operational Notice</option>
                        <option value="Exam Special">Exam Special</option>
                        <option value="Special Feast">Special Feast</option>
                        <option value="Billing Notice">Billing Notice</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">Target Audience</label>
                      <select
                        value={noticeTarget}
                        onChange={(e) => setNoticeTarget(e.target.value)}
                        className="text-xs"
                      >
                        <option value="All Campuses & Hostels">All Hostels (1,840 Students)</option>
                        <option value="Buddha Hostel Only">Buddha Hostel (450 Students)</option>
                        <option value="Aryabhatta Block Only">Aryabhatta Block (450 Students)</option>
                        <option value="Gargi Girls Hostel">Gargi Girls Hostel (400 Students)</option>
                        <option value="Nalanda Hall">Nalanda Hall (540 Students)</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block">Quick Template Presets:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { title: 'Exam Midnight Tea Service', cat: 'Exam Special', content: 'Mess halls will provide midnight tea, hot milk, and biscuits from 11:30 PM to 01:00 AM across all campus hostels during examinations.' },
                        { title: 'Sunday Special Feast Voting', cat: 'Special Feast', content: 'Polls for next Sunday\'s special lunch are now live on student dashboards. Cast your votes before Friday 10 PM.' },
                        { title: 'Water Tank Pipeline Sanitization', cat: 'Maintenance', content: 'Central water purifiers will undergo scheduled UV filter replacement on Saturday from 2 PM to 4 PM. Stored water is available.' }
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setNoticeTitle(preset.title);
                            setNoticeCategory(preset.cat);
                            setNoticeContent(preset.content);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors cursor-pointer border border-slate-200"
                        >
                          + {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Announcement Content *</label>
                    <textarea 
                      placeholder="Write full official announcement text here..." 
                      value={noticeContent} 
                      onChange={(e) => setNoticeContent(e.target.value)} 
                      rows={4} 
                      required
                      className="text-xs leading-relaxed" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary text-xs py-2.5 w-full justify-center cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" /> Broadcast Announcement Now
                  </button>
                </form>
              </div>

              {/* Sent Announcements History Box (7 Cols) */}
              <div className="lg:col-span-7 card-clean p-5 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      Sent Campus Announcements Log
                    </h4>
                    <p className="text-[11px] text-slate-500">Official notices currently active on student portals and mobile app</p>
                  </div>
                  <span className="badge badge-emerald text-xs font-bold">
                    {campusNoticesList.length} Active
                  </span>
                </div>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {campusNoticesList.map((n) => (
                    <div 
                      key={n.id} 
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 transition-all hover:border-slate-300 hover:bg-slate-100/50 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{n.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-emerald text-[10px]">{n.category}</span>
                            <span className="text-slate-500 font-medium text-[11px]">{n.target}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
                          <button
                            onClick={() => handleDeleteNotice(n.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-white transition-colors cursor-pointer"
                            title="Withdraw / Delete notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed pl-1 border-l-2 border-emerald-500 py-0.5">
                        {n.content}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Published by Campus Administration • Active
                        </span>
                        <span className="text-slate-400 font-mono">Notice #{n.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STUDENT COMPLAINTS DESK TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Student Complaints Desk</h3>
              <p className="text-xs text-slate-600">Campus-wide ticket tracker with 24-hour resolution monitoring.</p>
            </div>

            <div className="space-y-3">
              {COMPLAINTS_DATA.map((c) => (
                <div key={c.id} className="card-clean p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{c.id}: {c.issue}</span>
                    <span className="badge badge-amber">{c.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Resident: {c.student} (Room {c.room})</span>
                    <span>Category: {c.category} • Posted: {c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXAM & EVENT MESS-OFF TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Academic Calendar & Event Mess-Off Override</h3>
              <p className="text-xs text-slate-600">Schedule official campus holidays or exam leaves for automatic bulk mess-off processing.</p>
            </div>

            {eventCreated && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold">
                ✓ Campus holiday event registered! Automatic mess-off applied for 1,840 students.
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="card-clean p-6 space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Holiday / Event Title:</label>
                <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Start Date:</label>
                  <input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">End Date:</label>
                  <input type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} className="text-xs" />
                </div>
              </div>

              <button type="submit" className="btn-primary text-xs py-2.5 cursor-pointer">
                <Calendar className="w-4 h-4" /> Apply Institutional Mass Mess-Off
              </button>
            </form>
          </div>
        )}

        {/* ADMIN PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Administrative Officer Profile</h3>
                <p className="text-xs text-slate-600">Institutional credentials & campus governance authorization</p>
              </div>
              <button className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer">
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="card-clean p-6 text-center space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 to-emerald-950 text-emerald-400 font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-emerald-500">
                  ADM
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Dr. A. K. Choudhary</h4>
                  <p className="text-xs text-slate-500 font-mono">Officer ID: ADM-CAMPUS-01</p>
                  <span className="badge badge-emerald mt-2">Chief Warden & Dean</span>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 text-left">
                  <p><strong>Institution:</strong> Bihar Institute Campus</p>
                  <p><strong>Jurisdiction:</strong> 4 Hostel Blocks</p>
                  <p><strong>Campus HQ:</strong> Sabour Main Campus</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="card-clean p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Governance Credentials & Access Rights</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">System Security Clearance</span>
                      <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Level 5 Master Admin
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Audit License</span>
                      <span className="font-mono font-bold text-slate-800">STATE-CAMPUS-GOV-2026</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Billing Engine Authorization</span>
                      <span className="font-bold text-slate-800">1-Click Automated Run Rights</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Notice Broadcast Rights</span>
                      <span className="font-bold text-slate-800">Global Campus Push Active</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Official Contact Email</span>
                      <span className="font-mono text-slate-800">dean.welfare@biharinstitute.edu.in</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Office Contact</span>
                      <span className="font-mono font-semibold text-slate-800">+91 641 245 0912</span>
                    </div>
                  </div>
                </div>

                <div className="card-clean p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 block">Security Audit Trail</span>
                    <span className="text-slate-300">All financial disbursements and billing actions logged in institutional audit ledger.</span>
                  </div>
                  <Lock className="w-7 h-7 text-emerald-400 shrink-0" />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
