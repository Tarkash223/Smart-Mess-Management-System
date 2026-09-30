import React, { useState } from 'react';
import { 
  Home, Utensils, Star, Calendar, MessageSquare, Activity, User, ChevronDown, LogOut,
  Clock, CheckCircle2, AlertCircle, Send, CreditCard, Plus, Trash2,
  Vote, QrCode, Gift, FileText, CheckSquare, Sparkles, Heart, Droplets, ShieldCheck, Edit3, DollarSign, TrendingUp, X
} from 'lucide-react';
import { DEMO_STUDENT, COMPLAINTS_DATA, TODAY_MENU, ITEM_RATINGS } from '../data/mockData';

export default function StudentPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  // Quick Next Meal Skip State
  const [skipLunchToday, setSkipLunchToday] = useState(false);
  const [skipDinnerToday, setSkipDinnerToday] = useState(false);

  // Student Food Poll State
  const [pollVoted, setPollVoted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState('Chole Bhature');

  // Dietary Preference State
  const [dietPreference, setDietPreference] = useState('Pure Veg');
  const [isFastingToday, setIsFastingToday] = useState(false);
  const [allergyNote, setAllergyNote] = useState('Lactose Sensitive');

  // Advance Date Range Mess-Off State
  const [messOffRequests, setMessOffRequests] = useState([
    { id: 'MO-801', startDate: '2026-10-01', endDate: '2026-10-04', meals: ['Breakfast', 'Lunch', 'Dinner'], reason: 'Festival Home Leave', status: 'Approved' }
  ]);
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-12');
  const [skipBreakfast, setSkipBreakfast] = useState(true);
  const [skipLunch, setSkipLunch] = useState(true);
  const [skipDinner, setSkipDinner] = useState(true);
  const [messOffReason, setMessOffReason] = useState('Mid-Term Vacation / Home Visit');
  const [messOffSuccess, setMessOffSuccess] = useState(false);

  // Rating State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedMealForRating, setSelectedMealForRating] = useState('Lunch');
  const [taste, setTaste] = useState(5);
  const [quality, setQuality] = useState(4);
  const [quantity, setQuantity] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const renderStarRating = (value, setValue, label) => (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-none">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <Star 
              className={`w-5 h-5 ${
                star <= value 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-slate-200 fill-slate-100 hover:text-amber-200'
              }`} 
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-1.5 w-6">{value}/5</span>
      </div>
    </div>
  );

  // Complaint State
  const [complaints, setComplaints] = useState(COMPLAINTS_DATA);
  const [newComplaint, setNewComplaint] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Food Quality');

  // Water Intake Logger State
  const [waterGlasses, setWaterGlasses] = useState(5);

  // Student Daily Expense Tracker State
  const [studentExpenses, setStudentExpenses] = useState([
    { id: 1, item: 'Monthly Mess Subscription', amount: 2400, category: 'Mess Fee', date: '01 Sept' },
    { id: 2, item: 'Extra Plate – Lunch Guest', amount: 80, category: 'Extra Plate', date: '12 Sept' },
    { id: 3, item: 'Canteen Snacks (Evening)', amount: 45, category: 'Canteen', date: '15 Sept' },
    { id: 4, item: 'Late-Night Tea (Exam Week)', amount: 20, category: 'Canteen', date: '20 Sept' },
  ]);
  const [studentExpItem, setStudentExpItem] = useState('');
  const [studentExpAmount, setStudentExpAmount] = useState('');
  const [studentExpCategory, setStudentExpCategory] = useState('Canteen');

  const handleAddStudentExpense = (e) => {
    e.preventDefault();
    if (!studentExpItem.trim() || !studentExpAmount) return;
    setStudentExpenses([{
      id: studentExpenses.length + 1,
      item: studentExpItem,
      amount: Number(studentExpAmount),
      category: studentExpCategory,
      date: 'Just now'
    }, ...studentExpenses]);
    setStudentExpItem('');
    setStudentExpAmount('');
  };

  const handleAddMessOffRequest = (e) => {
    e.preventDefault();
    const selectedMeals = [];
    if (skipBreakfast) selectedMeals.push('Breakfast');
    if (skipLunch) selectedMeals.push('Lunch');
    if (skipDinner) selectedMeals.push('Dinner');

    const newReq = {
      id: `MO-${802 + messOffRequests.length}`,
      startDate,
      endDate,
      meals: selectedMeals,
      reason: messOffReason,
      status: 'Approved'
    };

    setMessOffRequests([newReq, ...messOffRequests]);
    setMessOffSuccess(true);
    setTimeout(() => setMessOffSuccess(false), 3500);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingSubmitted(false);
      setShowRatingModal(false);
    }, 1500);
  };

  const handleAddComplaint = (e) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;
    const ticket = {
      id: `TKT-${110 + complaints.length}`,
      student: DEMO_STUDENT.name,
      room: DEMO_STUDENT.roomNo,
      issue: newComplaint,
      category: complaintCategory,
      status: "Under Review",
      date: "Today"
    };
    setComplaints([ticket, ...complaints]);
    setNewComplaint('');
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'menu', label: 'Menu & Nutrition Calendar', icon: Utensils },
    { id: 'mess-off', label: 'Mess-Off Request', icon: Calendar },
    { id: 'polls', label: 'Student Food Polls', icon: Vote },
    { id: 'feedback', label: 'Rate Meals', icon: Star },
    { id: 'meals', label: 'NFC Scan History', icon: CreditCard },
    { id: 'qr-pass', label: 'Digital QR & NFC Pass', icon: QrCode },
    { id: 'diet', label: 'Dietary & Fasting Manager', icon: CheckSquare },
    { id: 'nutrition', label: 'Nutrition & Health', icon: Activity },
    { id: 'expenses', label: 'My Expense Tracker', icon: DollarSign },
    { id: 'billing', label: 'Invoices & Billing', icon: FileText },
    { id: 'complaints', label: 'Complaints Desk', icon: MessageSquare },
    { id: 'profile', label: 'Student Profile', icon: User }
  ];

  const nfcTapHistory = [
    { date: 'Today, 28 Sept', time: '08:14 AM', shift: 'Breakfast', gate: 'Sabour Mess A - Gate 1', method: 'NFC Card Swipe', status: 'Verified ✅' },
    { date: 'Yesterday, 27 Sept', time: '08:30 PM', shift: 'Dinner', gate: 'Sabour Mess A - Gate 1', method: 'QR Scan', status: 'Verified ✅' },
    { date: 'Yesterday, 27 Sept', time: '01:05 PM', shift: 'Lunch', gate: 'Sabour Mess A - Gate 2', method: 'NFC Card Swipe', status: 'Verified ✅' },
    { date: 'Yesterday, 27 Sept', time: '08:10 AM', shift: 'Breakfast', gate: 'Sabour Mess A - Gate 1', method: 'NFC Card Swipe', status: 'Verified ✅' },
    { date: '26 Sept 2026', time: '08:25 PM', shift: 'Dinner', gate: 'Sabour Mess A - Gate 1', method: 'NFC Card Swipe', status: 'Verified ✅' }
  ];

  const studentOverview = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
      <div>
        <span className="text-xs text-emerald-400 font-semibold block">Hostel Resident View</span>
        <h2 className="text-2xl font-bold">Good Morning, {DEMO_STUDENT.name}</h2>
        <p className="text-xs text-slate-300 mt-1">
          {DEMO_STUDENT.hostel} • Room {DEMO_STUDENT.roomNo} • Roll: {DEMO_STUDENT.rollNo}
        </p>
      </div>

      <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
        <span className="text-[10px] text-slate-400 block">Today's Mess Status</span>
        <span className="text-xs font-bold text-emerald-400">
          {skipLunchToday ? 'LUNCH SKIPPED (MESS-OFF)' : 'MEAL BOOKED ✅'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden portal-container">
      
      {/* Sidebar — horizontal scrollable on mobile, vertical column on md+ */}
      <aside className="portal-sidebar shrink-0">
        <div className="sidebar-brand px-3 py-2 border-b border-slate-200 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student Portal</span>
          <h3 className="text-sm font-bold text-slate-900">{DEMO_STUDENT.name}</h3>
          <p className="text-[11px] text-slate-500 font-medium">{DEMO_STUDENT.hostel}</p>
        </div>

        {activeTab === 'home' && (
          <div className="student-mobile-overview">{studentOverview}</div>
        )}

        <button
          type="button"
          className="portal-feature-toggle"
          aria-expanded={featuresOpen}
          aria-controls="student-portal-navigation"
          onClick={() => setFeaturesOpen((open) => !open)}
        >
          <span>Features</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
        </button>

        <nav id="student-portal-navigation" className={`space-y-1 portal-navigation ${featuresOpen ? 'is-open' : ''}`}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setFeaturesOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all cursor-pointer rounded-xl ${
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

        {/* Birthday Perk Alert - hidden on mobile */}
        <div className="sidebar-brand bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1 mt-2">
          <span className="text-[10px] text-amber-800 font-bold uppercase flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-amber-600" /> Birthday Perk Flag
          </span>
          <p className="text-[11px] text-slate-800 font-medium">Flagged on Cashier Panel for complimentary birthday treat!</p>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto min-w-0">
        
        {/* DASHBOARD HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            <div className="student-desktop-overview">{studentOverview}</div>

            {/* Today's Meals Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Today's Meals Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Breakfast */}
                <div className="card-clean p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Breakfast</span>
                    <span className="text-[11px] text-slate-500 font-medium">8:00 AM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Poha + Fresh Banana</h4>
                    <p className="text-xs text-slate-500">Hot Tea & Milk • 260 kcal</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="badge badge-emerald">Served</span>
                    <button 
                      onClick={() => { setSelectedMealForRating('Breakfast'); setShowRatingModal(true); }}
                      className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Rate Meal ⭐
                    </button>
                  </div>
                </div>

                {/* Lunch */}
                <div className={`card-clean p-4 space-y-3 ${skipLunchToday ? 'border-amber-300 bg-amber-50/40' : 'border-emerald-300 bg-emerald-50/30'}`}>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">Lunch</span>
                    <span className="text-[11px] text-slate-500 font-medium">1:00 PM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Rice + Dal + Sabzi + Roti</h4>
                    <p className="text-xs text-slate-500">Curd & Fresh Salad • 580 kcal</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className={`badge ${skipLunchToday ? 'badge-amber' : 'badge-emerald'}`}>
                      {skipLunchToday ? 'Opted Out' : 'Upcoming'}
                    </span>
                    <button 
                      onClick={() => setSkipLunchToday(!skipLunchToday)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                    >
                      {skipLunchToday ? 'Re-enable Meal' : 'Skip Today\'s Lunch'}
                    </button>
                  </div>
                </div>

                {/* Dinner */}
                <div className="card-clean p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">Dinner</span>
                    <span className="text-[11px] text-slate-500 font-medium">8:00 PM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Roti + Paneer + Sabzi</h4>
                    <p className="text-xs text-slate-500">Jeera Rice & Kheer • 490 kcal</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="badge badge-slate">Scheduled</span>
                    <button 
                      onClick={() => { setSelectedMealForRating('Dinner'); setShowRatingModal(true); }}
                      className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Rate Meal ⭐
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Actions & Poll Shortcut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Poll Widget */}
              <div className="card-clean p-5 space-y-3 bg-emerald-50/40 border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="badge badge-emerald">Sunday Special Choice Poll</span>
                  <span className="text-[11px] text-slate-500 font-mono">142 Votes Cast</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Vote for Next Sunday's Special Lunch:</h4>
                
                {pollVoted ? (
                  <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Vote Recorded for "{selectedPollOption}"! Catering prep volume updated.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {['Chole Bhature & Sweet Lassi', 'Veg Biryani & Raita', 'Paneer Kulcha & Dal Makhani'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-xs text-slate-800 bg-white p-2 rounded-lg border border-slate-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="sundayPoll" 
                          checked={selectedPollOption === opt}
                          onChange={() => setSelectedPollOption(opt)}
                          className="accent-emerald-600"
                        />
                        {opt}
                      </label>
                    ))}
                    <button 
                      onClick={() => setPollVoted(true)} 
                      className="btn-primary text-xs py-1.5 w-full justify-center cursor-pointer"
                    >
                      Submit Food Choice Vote
                    </button>
                  </div>
                )}
              </div>

              {/* Mess Off Shortcut */}
              <div className="card-clean p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Advance Date Range Mess-Off</h4>
                <p className="text-xs text-slate-600">Going home for holidays or mid-term leave? Apply for custom multi-day mess-offs.</p>
                <button 
                  onClick={() => setActiveTab('mess-off')}
                  className="btn-secondary text-xs w-full justify-center cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-700" /> Open Mess-Off Manager
                </button>
              </div>

            </div>

          </div>
        )}

        {/* STUDENT PROFILE TAB (FULLY POPULATED) */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Profile & Mess Registration</h3>
                <p className="text-xs text-slate-600">Hostel residency records and verified dietary profile</p>
              </div>
              <button className="btn-secondary text-xs flex items-center justify-center gap-1.5 cursor-pointer self-center sm:self-auto">
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile Card */}
              <div className="card-clean p-6 text-center space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white">
                  RK
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{DEMO_STUDENT.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">Roll: {DEMO_STUDENT.rollNo}</p>
                  <span className="badge badge-emerald mt-2">{DEMO_STUDENT.branch}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p><strong>Hostel:</strong> {DEMO_STUDENT.hostel}</p>
                  <p><strong>Room No:</strong> {DEMO_STUDENT.roomNo}</p>
                  <p><strong>Mess Unit:</strong> {DEMO_STUDENT.messUnit}</p>
                </div>
              </div>

              {/* Details & Guardian Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="card-clean p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Institutional & Emergency Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Institution Campus</span>
                      <span className="font-semibold text-slate-800">{DEMO_STUDENT.institution}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">NFC Token Pass ID</span>
                      <span className="font-mono font-bold text-emerald-700">{DEMO_STUDENT.nfcCardId}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Active Meal Credits</span>
                      <span className="font-bold text-slate-900">{DEMO_STUDENT.mealCredits} Active Meals</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Blood Group</span>
                      <span className="font-bold text-red-600">B+ Positive</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Guardian Name</span>
                      <span className="font-semibold text-slate-800">Mr. Ramesh Kumar</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                      <span className="font-mono font-semibold text-slate-800">+91 94310 88291</span>
                    </div>
                  </div>
                </div>

                <div className="card-clean p-5 bg-emerald-50/40 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-left">
                  <div>
                    <span className="font-bold text-emerald-900 block">Dietary & Fasting Status</span>
                    <span className="text-emerald-700">Pure Veg • Lactose Sensitive • Normal Serving</span>
                  </div>
                  <button onClick={() => setActiveTab('diet')} className="btn-outline-emerald text-xs py-1.5 px-3 cursor-pointer self-center sm:self-auto">
                    Manage Diet
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* NUTRITION & HEALTH TAB (FULLY POPULATED) */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Nutrition & Daily Calorie Tracker</h3>
              <p className="text-xs text-slate-600">Macronutrient breakdowns auto-calculated for served hostel thali meals.</p>
            </div>

            {/* Daily Macros Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-clean p-4 border-emerald-300 bg-emerald-50/20">
                <span className="text-xs text-slate-500 block">Daily Energy Target</span>
                <span className="text-xl font-extrabold text-slate-900">1,330 / 2,100</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">kcal (63% Met)</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Protein Intake</span>
                <span className="text-xl font-extrabold text-emerald-700">62 Grams</span>
                <span className="text-[11px] text-slate-400 block mt-1">Poha + Eggs + Dal</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Carbohydrates</span>
                <span className="text-xl font-extrabold text-slate-900">210 Grams</span>
                <span className="text-[11px] text-slate-400 block mt-1">Basmati Rice & Roti</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Healthy Fats</span>
                <span className="text-xl font-extrabold text-slate-900">38 Grams</span>
                <span className="text-[11px] text-slate-400 block mt-1">Ghee & Curd</span>
              </div>
            </div>

            {/* Water Tracker Widget */}
            <div className="card-clean p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-500" /> Daily Hydration Tracker
                </span>
                <span className="font-mono font-bold text-blue-600">{waterGlasses} / 8 Glasses Hydrated</span>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <button 
                    key={g}
                    onClick={() => setWaterGlasses(g)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      g <= waterGlasses 
                        ? 'bg-blue-500 text-white shadow-xs' 
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    🥛 {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NFC SCAN HISTORY TAB (FULLY POPULATED) */}
        {activeTab === 'meals' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">NFC & QR Attendance History</h3>
                <p className="text-xs text-slate-600">Timestamped gate swipe records for verified meal serving.</p>
              </div>
              <span className="badge badge-emerald self-start sm:self-auto shrink-0">58 Active Credits</span>
            </div>

            <div className="card-clean p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Meal Shift</th>
                      <th className="p-3">Gate Location</th>
                      <th className="p-3">Verification Method</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {nfcTapHistory.map((row, i) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold">{row.date} • <span className="font-mono text-slate-500">{row.time}</span></td>
                        <td className="p-3 font-bold text-slate-900">{row.shift}</td>
                        <td className="p-3 text-slate-600">{row.gate}</td>
                        <td className="p-3 text-slate-700">{row.method}</td>
                        <td className="p-3 text-emerald-700 font-bold">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MESS-OFF REQUEST TAB (FLEXIBLE FUTURE MESS OFF) */}
        {activeTab === 'mess-off' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-semibold block uppercase tracking-wider">Attendance & Headcount Manager</span>
                <h3 className="text-xl font-bold">Mess-Off & Meal Skip Portal</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Opt out of upcoming meals or apply for advance multi-day date range mess-offs for holidays, home leave, or exams.
                </p>
              </div>
              <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">Cutoff Timing</span>
                <span className="text-xs font-bold text-emerald-400">10:00 PM Daily</span>
              </div>
            </div>

            {messOffSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mess-off application registered! Kitchen headcount and meal billing automatically updated.</span>
              </div>
            )}

            {/* Quick Skip Next Meal */}
            <div className="card-clean p-6 space-y-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1. Instant Next Meal Skip (आज का अगला भोजन छोड़ें)</h4>
                  <p className="text-xs text-slate-500">Toggle off your attendance for today's upcoming meal shift.</p>
                </div>
                <span className="badge badge-emerald text-[10px] self-start sm:self-auto shrink-0">Instant Kitchen Sync</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border transition-all ${skipLunchToday ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">Today's Lunch (1:00 PM)</span>
                    <span className={`badge ${skipLunchToday ? 'badge-amber' : 'badge-emerald'}`}>
                      {skipLunchToday ? 'Opted Out' : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Menu: Steamed Rice, Dal, Mix Veg, Curd, Chapati</p>
                  <button 
                    onClick={() => setSkipLunchToday(!skipLunchToday)}
                    className={`w-full btn-secondary text-xs py-2 justify-center cursor-pointer ${skipLunchToday ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : ''}`}
                  >
                    {skipLunchToday ? 'Re-enable Lunch Attendance ✓' : 'Skip Today\'s Lunch'}
                  </button>
                </div>

                <div className={`p-4 rounded-xl border transition-all ${skipDinnerToday ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">Today's Dinner (8:00 PM)</span>
                    <span className={`badge ${skipDinnerToday ? 'badge-amber' : 'badge-slate'}`}>
                      {skipDinnerToday ? 'Opted Out' : 'Scheduled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Menu: Butter Chapati, Paneer Sabzi, Jeera Rice</p>
                  <button 
                    onClick={() => setSkipDinnerToday(!skipDinnerToday)}
                    className={`w-full btn-secondary text-xs py-2 justify-center cursor-pointer ${skipDinnerToday ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : ''}`}
                  >
                    {skipDinnerToday ? 'Re-enable Dinner Attendance ✓' : 'Skip Today\'s Dinner'}
                  </button>
                </div>
              </div>
            </div>

            {/* Advance Date Range Mess Off Form */}
            <div className="card-clean p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">2. Advance Multi-Day Mess-Off Request (भविष्य की तिथि हेतु)</h4>
                <p className="text-xs text-slate-500">Apply for custom date ranges when traveling home, on holidays, or during exams.</p>
              </div>

              <form onSubmit={handleAddMessOffRequest} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Start Date (आरंभ तिथि):</label>
                    <input 
                      type="date" 
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">End Date (समाप्ति तिथि):</label>
                    <input 
                      type="date" 
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-xs p-2.5 rounded-xl border border-slate-200 w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-semibold text-slate-800 block">Meals to Skip (कौन सा भोजन छोड़ना है):</label>
                  <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-700 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <input 
                        type="checkbox" 
                        checked={skipBreakfast} 
                        onChange={(e) => setSkipBreakfast(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      🌅 Breakfast
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <input 
                        type="checkbox" 
                        checked={skipLunch} 
                        onChange={(e) => setSkipLunch(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      ☀️ Lunch
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <input 
                        type="checkbox" 
                        checked={skipDinner} 
                        onChange={(e) => setSkipDinner(e.target.checked)}
                        className="rounded accent-emerald-600 w-4 h-4"
                      />
                      🌙 Dinner
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Reason for Absence (कारण):</label>
                  <select 
                    value={messOffReason} 
                    onChange={(e) => setMessOffReason(e.target.value)}
                    className="text-xs p-2.5 rounded-xl border border-slate-200 w-full"
                  >
                    <option value="Festival Home Leave">Festival / Holiday Home Visit</option>
                    <option value="Mid-Term Vacation / Home Visit">Mid-Term Vacation</option>
                    <option value="Exam Leave / Study Prep">Exam Leave / Library Study</option>
                    <option value="Health / Medical Mess Skip">Health / Medical Reason</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary text-xs py-3 w-full justify-center cursor-pointer font-bold">
                  <Calendar className="w-4 h-4" /> Submit Mess-Off Application
                </button>
              </form>
            </div>

            {/* Active Mess Off Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Mess-Off Records</h4>
              <div className="space-y-2">
                {messOffRequests.map((mo) => (
                  <div key={mo.id} className="card-clean p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{mo.id}: {mo.startDate} to {mo.endDate}</span>
                        <span className="badge badge-emerald text-[10px]">{mo.status}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">
                        Skipped Meals: {mo.meals.join(', ')} • Reason: {mo.reason}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                      Kitchen Headcount Updated ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TODAY'S MENU TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Dynamic Menu & Nutrition Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-clean p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-700">Breakfast (7:30 AM - 9:30 AM)</span>
                <h4 className="font-bold text-slate-900">Poha, Boiled Eggs / Banana, Tea</h4>
                <p className="text-xs text-slate-500">Nutritional value: ~390 kcal • High Protein</p>
              </div>
              <div className="card-clean p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-700">Lunch (12:30 PM - 2:30 PM)</span>
                <h4 className="font-bold text-slate-900">Steamed Rice, Chapati, Dal Tadka, Mix Veg, Curd</h4>
                <p className="text-xs text-slate-500">Nutritional value: ~580 kcal • Balanced Meal</p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT FOOD POLLS TAB */}
        {activeTab === 'polls' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Interactive Student Food Choice Polls</h3>
              <p className="text-xs text-slate-600">Vote on weekly menu options to help mess managers prepare exact catering volumes.</p>
            </div>

            <div className="card-clean p-6 space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-900">Poll: Next Wednesday Special Dessert</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center">
                  <span>Gulab Jamun (2 Pcs)</span>
                  <span className="font-bold text-emerald-700">48% (120 Votes)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center">
                  <span>Rasgulla & Sweet Milk</span>
                  <span className="font-bold text-slate-700">32% (80 Votes)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center">
                  <span>Hot Gajar Ka Halwa</span>
                  <span className="font-bold text-slate-700">20% (50 Votes)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIETARY PREFERENCE TAB */}
        {activeTab === 'diet' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Dietary & Fasting Preference Manager</h3>
              <p className="text-xs text-slate-600">Set meal dietary preferences and religious fasting days to notify counter staff.</p>
            </div>

            <div className="card-clean p-6 space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Primary Food Preference:</label>
                <select value={dietPreference} onChange={(e) => setDietPreference(e.target.value)} className="text-xs">
                  <option value="Pure Veg">Pure Veg (शुद्ध शाकाहारी)</option>
                  <option value="Veg + Egg">Veg + Egg</option>
                  <option value="Non-Veg">Non-Veg Allowed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Food Allergy / Custom Note:</label>
                <input type="text" value={allergyNote} onChange={(e) => setAllergyNote(e.target.value)} className="text-xs" />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Religious Fasting Today (उपवास):</span>
                <button 
                  onClick={() => setIsFastingToday(!isFastingToday)}
                  className={`btn-secondary text-xs ${isFastingToday ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : ''}`}
                >
                  {isFastingToday ? 'Fasting Active (Sabudana / Fruit Meal)' : 'Normal Serving'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR & NFC PASS TAB */}
        {activeTab === 'qr-pass' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Multi-Format Verification Pass (QR & NFC)</h3>
              <p className="text-xs text-slate-600">Show this QR code at mess entrance scanners for zero-queue entry verification.</p>
            </div>

            <div className="card-clean p-6 max-w-md text-center space-y-4 mx-auto bg-slate-900 text-white">
              <span className="badge badge-emerald text-xs">Active Verification Token</span>
              <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center border-4 border-emerald-500">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>
              <div>
                <h4 className="font-bold text-base">{DEMO_STUDENT.name}</h4>
                <p className="text-xs text-slate-300 font-mono">NFC ID: {DEMO_STUDENT.nfcCardId}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">Instant Audio Chime Verified ✓</p>
              </div>
            </div>
          </div>
        )}

        {/* RATE MEALS & FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rate Meals & Student Reviews</h3>
                <p className="text-xs text-slate-600">Your ratings directly guide recipe adjustments, taste consistency, and food preparation.</p>
              </div>
              <span className="badge badge-emerald self-start sm:self-auto text-xs py-1 px-3">
                Direct Kitchen Feedback ✓
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Rating Form Card (5 Cols) */}
              <div className="lg:col-span-5 card-clean p-6 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Rate Today's Meal
                  </h4>
                  <span className="badge badge-emerald text-[10px] font-bold">{selectedMealForRating}</span>
                </div>

                {/* Meal Shift Selector */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {['Breakfast', 'Lunch', 'Dinner'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setSelectedMealForRating(m); setRatingSubmitted(false); }}
                      className={`py-1.5 px-2 rounded-lg cursor-pointer transition-all text-center ${
                        selectedMealForRating === m
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {ratingSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center space-y-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="font-bold text-sm">Rating Submitted Successfully!</p>
                    <p className="text-[11px] text-emerald-700">Your rating for {selectedMealForRating} has been sent to the Mess Manager.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRatingSubmit} className="space-y-4">
                    {/* Star Rating Factor Controls */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                      {renderStarRating(taste, setTaste, 'Taste & Flavor')}
                      {renderStarRating(quality, setQuality, 'Food Quality & Freshness')}
                      {renderStarRating(quantity, setQuantity, 'Portion Quantity')}
                      {renderStarRating(hygiene, setHygiene, 'Serving Hygiene')}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Feedback / Suggestions:</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Tadka was nice, dal had perfect consistency. Please keep salt low."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-xl p-3 text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed shadow-inner"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary w-full justify-center text-xs py-2.5 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-white" /> Submit Meal Rating
                    </button>
                  </form>
                )}
              </div>

              {/* Recent Dishes Ratings (7 Cols) */}
              <div className="lg:col-span-7 card-clean p-6 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-emerald-600" />
                      Hostel Dish Ratings Summary
                    </h4>
                    <p className="text-[11px] text-slate-500">Live sentiment from 450 resident students</p>
                  </div>
                  <span className="badge badge-emerald text-xs font-bold">Overall 4.6 ★</span>
                </div>

                <div className="space-y-3">
                  {ITEM_RATINGS.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{item.dish}</span>
                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-extrabold text-slate-900">{item.rating}</span>
                          <span className="text-[10px] text-slate-400">/ 5</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full" 
                          style={{ width: `${(item.rating / 5) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span className="badge badge-emerald text-[10px]">{item.category}</span>
                        <span>{item.votes} student votes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900">Register Complaint or Suggestion</h3>
            <form onSubmit={handleAddComplaint} className="card-clean p-4 space-y-3">
              <select 
                value={complaintCategory} 
                onChange={(e) => setComplaintCategory(e.target.value)}
                className="text-xs"
              >
                <option value="Food Quality">Food Quality</option>
                <option value="Hygiene & Cleanliness">Hygiene & Cleanliness</option>
                <option value="Quantity & Portion">Quantity & Portion</option>
                <option value="Menu Suggestion">Menu Suggestion</option>
              </select>
              <textarea 
                placeholder="Describe your issue..." 
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <button type="submit" className="btn-primary text-xs">Submit Ticket</button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Ticket Status</h4>
              {complaints.map((c) => (
                <div key={c.id} className="card-clean p-3 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{c.id}: {c.issue}</span>
                    <span className="text-slate-500 text-[11px]">{c.category} • {c.date}</span>
                  </div>
                  <span className="badge badge-amber">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVOICES & WHATSAPP ALERTS TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Monthly Mess Bill & WhatsApp Alerts</h3>
            <div className="card-clean p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-center border-b pb-2 text-xs">
                <span className="font-bold text-slate-900">September 2026 Mess Bill</span>
                <span className="badge badge-emerald">Paid ✓</span>
              </div>
              <p className="text-xs text-slate-600">Total Attendance: 58 Meals • Mess Off Credits: 4 Meals</p>
              <p className="text-base font-extrabold text-slate-900">Total Billed: ₹2,320</p>
            </div>
          </div>
        )}

        {/* MY EXPENSE TRACKER TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">My Mess & Canteen Expense Tracker</h3>
              <p className="text-xs text-slate-600">Log and track your mess fees, canteen spending, and extra plate costs.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-clean p-4 border-emerald-300 bg-emerald-50/30">
                <span className="text-xs text-slate-500 block">Total This Month</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  ₹{studentExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold block mt-1">September 2026</span>
              </div>
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Mess Fee Paid</span>
                <span className="text-xl font-extrabold text-slate-900">₹2,400</span>
                <span className="text-[11px] text-slate-400 block mt-1">Monthly Subscription</span>
              </div>
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Canteen Spent</span>
                <span className="text-xl font-extrabold text-slate-900">₹65</span>
                <span className="text-[11px] text-slate-400 block mt-1">Snacks & Tea</span>
              </div>
              <div className="card-clean p-4">
                <span className="text-xs text-slate-500 block">Extra Plates</span>
                <span className="text-xl font-extrabold text-slate-900">₹80</span>
                <span className="text-[11px] text-slate-400 block mt-1">Guest / Walk-In</span>
              </div>
            </div>

            {/* Log New Expense */}
            <form onSubmit={handleAddStudentExpense} className="card-clean p-5 space-y-3 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900">Log a New Expense</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="What was it? (e.g. Canteen tea)"
                  value={studentExpItem}
                  onChange={(e) => setStudentExpItem(e.target.value)}
                  className="text-xs"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={studentExpAmount}
                  onChange={(e) => setStudentExpAmount(e.target.value)}
                  className="text-xs"
                />
                <select
                  value={studentExpCategory}
                  onChange={(e) => setStudentExpCategory(e.target.value)}
                  className="text-xs"
                >
                  <option value="Canteen">Canteen</option>
                  <option value="Mess Fee">Mess Fee</option>
                  <option value="Extra Plate">Extra Plate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="btn-primary text-xs cursor-pointer">
                <DollarSign className="w-4 h-4" /> Add Entry
              </button>
            </form>

            {/* Expense Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expense History</h4>
              {studentExpenses.map((ex) => (
                <div key={ex.id} className="card-clean p-3.5 text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block">{ex.item}</span>
                    <span className="text-slate-500 text-[11px]">{ex.category} • {ex.date}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm shrink-0">₹{ex.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Centered Rating Modal when user clicks Rate Meal from Today's Schedule */}
      {showRatingModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowRatingModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Rate Meal: {selectedMealForRating}</h4>
                  <p className="text-xs text-slate-400">Share your instant feedback with kitchen staff</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRatingModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {ratingSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-base">Thank you for rating!</p>
                  <p className="text-xs text-emerald-700">Your score for {selectedMealForRating} has been sent to the Mess Manager.</p>
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    {renderStarRating(taste, setTaste, 'Taste & Flavor')}
                    {renderStarRating(quality, setQuality, 'Food Quality & Freshness')}
                    {renderStarRating(quantity, setQuantity, 'Portion Quantity')}
                    {renderStarRating(hygiene, setHygiene, 'Serving Hygiene')}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Feedback / Suggestions:</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Tadka was nice, dal had perfect consistency. Please keep salt low."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      className="w-full border-2 border-slate-300 rounded-xl p-3 text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed shadow-inner"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary w-full justify-center text-xs py-2.5 shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-white" /> Submit Meal Rating
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
