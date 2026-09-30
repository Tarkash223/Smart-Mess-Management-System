import React, { useState } from 'react';
import { 
  BarChart3, Utensils, Star, TrendingDown, CreditCard, MessageSquare, 
  FileText, Home, Users, CheckCircle2, Sliders, Calendar, Printer, DollarSign, Gift, Clock, Send, MessageCircle, QrCode, User, ShieldCheck, Edit3, AlertCircle, Bell, Megaphone, Inbox, Trash2, ScanLine, ChevronRight, ChevronDown, LogOut, Target, Zap, ClipboardList, ShoppingBag, Activity, TrendingUp, AlertOctagon
} from 'lucide-react';
import { TODAY_MENU, ITEM_RATINGS, COMPLAINTS_DATA } from '../data/mockData';
import { REDISTRIBUTION_RECEIVERS } from '../data/redistribution';
import { predictInstitutionalDemand } from '../utils/institutionalDemand';
import { findEligibleReceivers } from '../utils/surplusMatching';
import { getSurplusListingValidationMessage } from '../utils/surplusSafety';

export default function ManagerPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  // WhatsApp Reminder State
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [selectedStudentForWA, setSelectedStudentForWA] = useState('Rahul Kumar (Room 204)');
  
  // Meal Billing Counter State
  const [counterMealType, setCounterMealType] = useState('Lunch Thali');
  const [counterPrice, setCounterPrice] = useState(80);
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  const [selectedCookMeal, setSelectedCookMeal] = useState('lunch');
  const [eventType, setEventType] = useState('normal');
  const [messOffCounts, setMessOffCounts] = useState({ breakfast: 8, lunch: 0, snacks: 0, dinner: 4 });
  const [prepQuantities, setPrepQuantities] = useState({});
  const [actualConsumedInputs, setActualConsumedInputs] = useState({});
  const [wasteInputs, setWasteInputs] = useState({});
  const [operationMessage, setOperationMessage] = useState('');
  const [mealOperations, setMealOperations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smartmess_meal_operations_v1') || '{}');
    } catch {
      return {};
    }
  });
  const [surplusListings, setSurplusListings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smartmess_surplus_listings_v1') || '[]');
    } catch {
      return [];
    }
  });
  const [surplusMeal, setSurplusMeal] = useState('');
  const [surplusFoodName, setSurplusFoodName] = useState('');
  const [surplusFoodCategory, setSurplusFoodCategory] = useState('vegetarian');
  const [surplusLocation, setSurplusLocation] = useState('Central Mess A, Sabour Main Campus');
  const [surplusPreparedAt, setSurplusPreparedAt] = useState('');
  const [surplusAvailableUntil, setSurplusAvailableUntil] = useState('');
  const [surplusTemperature, setSurplusTemperature] = useState('');
  const [surplusSafetyVerified, setSurplusSafetyVerified] = useState(false);
  const [surplusQualityVerified, setSurplusQualityVerified] = useState(false);
  const [surplusMessage, setSurplusMessage] = useState('');

  const activeResidents = 112;
  const feedbackRatings = { breakfast: 4.5, lunch: 4.2, snacks: 4.0, dinner: 4.6 };
  const eventImpacts = { normal: 0, event: 0.08, holiday: -0.12 };
  const demandForecast = predictInstitutionalDemand({
    meal: selectedCookMeal,
    activeResidents,
    messOffCount: Number(messOffCounts[selectedCookMeal] || 0),
    feedbackRating: feedbackRatings[selectedCookMeal],
    eventImpact: eventImpacts[eventType]
  });
  const currentMealOperation = mealOperations[selectedCookMeal] || {};
  const eligibleSurplusMeals = Object.entries(mealOperations).filter(([meal, operation]) => {
    const alreadyListed = surplusListings
      .filter((listing) => listing.sourceMeal === meal)
      .reduce((total, listing) => total + listing.quantity, 0);
    return operation.outcomeRecordedAt && operation.remaining - operation.waste - alreadyListed > 0;
  });
  const selectedSurplusMeal = eligibleSurplusMeals.some(([meal]) => meal === surplusMeal)
    ? surplusMeal
    : eligibleSurplusMeals[0]?.[0] || '';
  const selectedSurplusOperation = mealOperations[selectedSurplusMeal];
  const alreadyListedQuantity = surplusListings
    .filter((listing) => listing.sourceMeal === selectedSurplusMeal)
    .reduce((total, listing) => total + listing.quantity, 0);
  const eligibleSurplusQuantity = selectedSurplusOperation
    ? Math.max(0, selectedSurplusOperation.remaining - selectedSurplusOperation.waste - alreadyListedQuantity)
    : 0;
  const preparedInput = Number(prepQuantities[selectedCookMeal] ?? currentMealOperation.prepared ?? demandForecast.recommendedPortions);
  const consumedInput = actualConsumedInputs[selectedCookMeal] ?? currentMealOperation.consumed ?? '';
  const wasteInput = wasteInputs[selectedCookMeal] ?? currentMealOperation.waste ?? '';

  const saveMealOperation = (meal, updates) => {
    setMealOperations((current) => {
      const next = { ...current, [meal]: { ...current[meal], ...updates } };
      localStorage.setItem('smartmess_meal_operations_v1', JSON.stringify(next));
      return next;
    });
  };

  const handleApprovePrep = () => {
    if (!Number.isInteger(preparedInput) || preparedInput < 1) {
      setOperationMessage('Enter a valid preparation quantity before approval.');
      return;
    }
    saveMealOperation(selectedCookMeal, { prepared: preparedInput, prepApproved: true });
    setOperationMessage(`${preparedInput} ${selectedCookMeal} portions approved for preparation.`);
  };

  const handleRecordMealOutcome = () => {
    if (consumedInput === '' || wasteInput === '') {
      setOperationMessage('Enter both consumed and wasted portions before saving the meal outcome.');
      return;
    }
    const consumed = Number(consumedInput);
    const waste = Number(wasteInput);
    const remaining = preparedInput - consumed;
    if (!Number.isInteger(preparedInput) || preparedInput < 1 || !Number.isInteger(consumed) || consumed < 0 || consumed > preparedInput) {
      setOperationMessage('Consumed portions must be a whole number between zero and prepared quantity.');
      return;
    }
    if (!Number.isInteger(waste) || waste < 0 || waste > remaining) {
      setOperationMessage('Waste must be a whole number no greater than the remaining portions.');
      return;
    }
    saveMealOperation(selectedCookMeal, {
      prepared: preparedInput,
      consumed,
      waste,
      remaining,
      outcomeRecordedAt: new Date().toLocaleString()
    });
    setOperationMessage('Meal outcome saved. Surplus and waste are now included in this shift record.');
  };

  const handleCreateSurplusListing = (event) => {
    event.preventDefault();
    const listing = {
      foodName: surplusFoodName,
      foodCategory: surplusFoodCategory,
      quantity: eligibleSurplusQuantity,
      quantityUnit: 'portions',
      sourceMeal: selectedSurplusMeal,
      location: surplusLocation,
      preparedAt: surplusPreparedAt,
      availableUntil: surplusAvailableUntil,
      temperatureC: surplusTemperature,
      safetyVerified: surplusSafetyVerified,
      qualityVerified: surplusQualityVerified
    };
    const validationMessage = getSurplusListingValidationMessage(listing);
    if (validationMessage) {
      setSurplusMessage(validationMessage);
      return;
    }

    const newListing = {
      ...listing,
      id: `${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
      verifiedByRole: 'Mess Manager'
    };
    setSurplusListings((current) => {
      const next = [newListing, ...current];
      localStorage.setItem('smartmess_surplus_listings_v1', JSON.stringify(next));
      return next;
    });
    setSurplusFoodName('');
    setSurplusPreparedAt('');
    setSurplusAvailableUntil('');
    setSurplusTemperature('');
    setSurplusSafetyVerified(false);
    setSurplusQualityVerified(false);
    setSurplusMessage('Safety checks recorded. Surplus is listed as available; no receiver or delivery is assigned automatically.');
  };

  const handleUpdateSurplusStatus = (listingId, status) => {
    const allowedNextStatuses = {
      Requested: ['Accepted', 'Available'],
      Accepted: ['Pickup scheduled', 'Available'],
      'Pickup scheduled': ['Delivered'],
      Delivered: ['Completed'],
      Completed: []
    };
    setSurplusListings((current) => {
      const next = current.map((listing) => {
        if (listing.id !== listingId || !allowedNextStatuses[listing.status]?.includes(status)) return listing;
        if (status === 'Available') {
          const { receiverId: _receiverId, receiverName: _receiverName, requestedAt: _requestedAt, requestedBy: _requestedBy, ...availableListing } = listing;
          return { ...availableListing, status };
        }
        return { ...listing, status };
      });
      localStorage.setItem('smartmess_surplus_listings_v1', JSON.stringify(next));
      return next;
    });
  };

  const handleRequestSurplusPickup = (listingId, receiver) => {
    setSurplusListings((current) => {
      const next = current.map((listing) => listing.id === listingId && listing.status === 'Available'
        ? { ...listing, status: 'Requested', receiverId: receiver.id, receiverName: receiver.name, requestedBy: 'provider', requestedAt: new Date().toISOString() }
        : listing);
      localStorage.setItem('smartmess_surplus_listings_v1', JSON.stringify(next));
      return next;
    });
  };

  // Meal Shift Pricing State
  const [breakfastPrice, setBreakfastPrice] = useState(40);
  const [lunchPrice, setLunchPrice] = useState(80);
  const [snacksPrice, setSnacksPrice] = useState(30);
  const [dinnerPrice, setDinnerPrice] = useState(90);
  const [pricesSaved, setPricesSaved] = useState(false);

  // Expense Logger State (Kitchen/Operations only)
  const [expenses, setExpenses] = useState([
    { id: 1, item: 'Fresh Vegetables & Grain Procurement', amount: 4200, category: 'Grocery', date: 'Today' },
    { id: 2, item: 'LPG Commercial Gas Cylinder (2 Pcs)', amount: 3600, category: 'Fuel', date: 'Yesterday' }
  ]);
  const [expenseItem, setExpenseItem] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Shift Timings State
  const [breakfastTime, setBreakfastTime] = useState('07:30 AM - 09:30 AM');
  const [lunchTime, setLunchTime] = useState('12:30 PM - 02:30 PM');
  const [dinnerTime, setDinnerTime] = useState('08:00 PM - 10:00 PM');
  const [shiftSaved, setShiftSaved] = useState(false);

  // Manager Complaints State
  const [managerComplaints, setManagerComplaints] = useState(COMPLAINTS_DATA);

  // Broadcast Message State
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('All Students');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [broadcastHistory, setBroadcastHistory] = useState([
    { id: 1, message: 'Mess will be closed on 2nd Oct (Gandhi Jayanti). Packed meals available at counter.', target: 'All Students', sentAt: '28 Sept, 9:00 AM' },
    { id: 2, message: 'Wednesday special: Litti Chokha & Sattu Sharbat for lunch. Come on time!', target: 'All Students', sentAt: '25 Sept, 7:30 AM' },
  ]);

  // Student Inbox State (messages from students)
  const studentInboxMessages = [
    { id: 1, from: 'Rahul Kumar (Room 204)', type: 'Complaint', message: 'Rice was undercooked at lunch today. Please check.', time: 'Today, 2:10 PM', urgent: true },
    { id: 2, from: 'Priya Sharma (Room 108)', type: 'Suggestion', message: 'Can we have more sabzi variety on Fridays?', time: 'Today, 11:45 AM', urgent: false },
    { id: 3, from: 'Aditya Singh (Room 112)', type: 'Request', message: 'Please note I have a peanut allergy. Kindly inform kitchen staff.', time: 'Yesterday, 6:30 PM', urgent: true },
    { id: 4, from: 'Vikas Sharma (Room 305)', type: 'Poll Response', message: 'Voted for Veg Biryani in Sunday poll.', time: 'Yesterday, 3:00 PM', urgent: false },
    { id: 5, from: 'Suman Roy (Room 401)', type: 'Mess-Off Notice', message: 'Applied mess-off for Oct 1–4. Reason: Festival leave.', time: '26 Sept, 8:00 AM', urgent: false },
  ];

  const handlePrintReceipt = () => {
    setReceiptPrinted(true);
    setTimeout(() => setReceiptPrinted(false), 3000);
  };

  const handleSendWhatsAppReminder = () => {
    setWhatsAppSent(true);
    setTimeout(() => setWhatsAppSent(false), 3000);
  };

  const handleSavePrices = (e) => {
    e.preventDefault();
    setPricesSaved(true);
    setTimeout(() => setPricesSaved(false), 3000);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseItem || !expenseAmount) return;
    setExpenses([{ id: expenses.length + 1, item: expenseItem, amount: Number(expenseAmount), category: 'Daily Log', date: 'Just now' }, ...expenses]);
    setExpenseItem('');
    setExpenseAmount('');
  };

  const handleSaveShifts = (e) => {
    e.preventDefault();
    setShiftSaved(true);
    setTimeout(() => setShiftSaved(false), 3000);
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setManagerComplaints(managerComplaints.map(c => c.id === ticketId ? { ...c, status: newStatus } : c));
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    setBroadcastHistory([{
      id: broadcastHistory.length + 1,
      message: broadcastMsg,
      target: broadcastTarget,
      sentAt: 'Just now'
    }, ...broadcastHistory]);
    setBroadcastMsg('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleDeleteBroadcast = (id) => {
    setBroadcastHistory(broadcastHistory.filter(b => b.id !== id));
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'qr-attendance', label: 'QR Attendance', icon: QrCode },
    { id: 'student-attendance', label: 'Student Attendance', icon: Users },
    { id: 'mess-offs', label: 'Mess-Offs / Exemptions', icon: ClipboardList },
    { id: 'food-prep', label: 'Food Prep & Cooking', icon: Utensils },
    { id: 'wastage', label: 'Wastage Monitor', icon: TrendingDown },
    { id: 'surplus', label: 'Surplus & Safety', icon: ShieldCheck },
    { id: 'counter', label: 'Meal Billing Counter', icon: Printer },
    { id: 'inventory', label: 'Inventory & Waste Log', icon: TrendingDown },
    { id: 'whatsapp', label: 'WhatsApp Payment Alerts', icon: MessageCircle },
    { id: 'expenses', label: 'Kitchen Expense Log', icon: DollarSign },
    { id: 'shifts', label: 'Meal Timings & Access', icon: Clock },
    { id: 'pricing', label: 'Meal Pricing Setup', icon: Sliders },
    { id: 'forecast', label: 'Daily Cooking Quantity', icon: BarChart3 },
    { id: 'calendar', label: 'Weekly Menu Planner', icon: Calendar },
    { id: 'feedback', label: 'Student Ratings', icon: Star },
    { id: 'complaints', label: 'Student Complaints & Issues', icon: MessageSquare },
    { id: 'inbox', label: 'Student Messages', icon: Inbox },
    { id: 'broadcast', label: 'Send Announcement', icon: Megaphone },
    { id: 'profile', label: 'Manager Profile', icon: User }
  ];

  const pendingDuesList = [
    { name: 'Rahul Kumar', room: 'Buddha Block - 204', due: '₹480', daysOverdue: 3 },
    { name: 'Aditya Singh', room: 'Buddha Block - 112', due: '₹720', daysOverdue: 5 },
    { name: 'Vikas Sharma', room: 'Aryabhatta Block - 305', due: '₹340', daysOverdue: 2 },
    { name: 'Suman Roy', room: 'Buddha Block - 401', due: '₹960', daysOverdue: 7 }
  ];

  const weeklyMenuPlan = [
    { day: 'Monday', breakfast: 'Aloo Paratha & Butter', lunch: 'Rajma Chawal + Curd', dinner: 'Matar Paneer & Chapati' },
    { day: 'Tuesday', breakfast: 'Idli Sambhar & Chutney', lunch: 'Kadi Chawal & Bhindi', dinner: 'Mix Veg + Dal Makhani' },
    { day: 'Wednesday', breakfast: 'Poha & Jalebi', lunch: 'Special Litti Chokha & Sattu', dinner: 'Egg Curry / Paneer Do Pyaza' },
    { day: 'Thursday', breakfast: 'Puri Sabzi & Halwa', lunch: 'Chana Dal + Veg Pulao', dinner: 'Aloo Gobi & Roti' },
    { day: 'Friday', breakfast: 'Upma & Fruit Juice', lunch: 'Dal Fry & Jeera Rice', dinner: 'Shahi Paneer & Rice' },
    { day: 'Saturday', breakfast: 'Bread Butter & Milk', lunch: 'Khichdi & Chokha + Papad', dinner: 'Veg Biryani & Raita' },
    { day: 'Sunday', breakfast: 'Chole Bhature', lunch: 'Special Choice Poll Winner', dinner: 'Kheer & Special Thali' }
  ];

  const managerOverview = (
    <div className="bg-emerald-800 text-white rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{background: 'radial-gradient(ellipse at 80% 50%, #34d399 0%, transparent 70%)'}} />
      <div className="relative space-y-1">
        <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-semibold">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Hostel Number 4 • Operational Central Dining Desk
        </div>
        <h2 className="text-xl font-extrabold leading-tight">Central Dining Operations</h2>
        <p className="text-sm text-emerald-200">
          Active Meal Session: <span className="font-bold text-white">Breakfast (08:00 AM – 10:30 AM)</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden portal-container">
      
      {/* Sidebar — horizontal scrollable on mobile, vertical column on md+ */}
      <aside className="portal-sidebar shrink-0">
        <div className="sidebar-brand px-3 py-2 border-b border-slate-200 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Manager Console</span>
          <h3 className="text-sm font-bold text-slate-900">Central Mess A</h3>
          <p className="text-[11px] text-slate-500 font-medium">Sabour Main Campus</p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="manager-mobile-overview">{managerOverview}</div>
        )}

        <button
          type="button"
          className="portal-feature-toggle"
          aria-expanded={featuresOpen}
          aria-controls="manager-portal-navigation"
          onClick={() => setFeaturesOpen((open) => !open)}
        >
          <span>Features</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
        </button>

        <nav id="manager-portal-navigation" className={`space-y-1 portal-navigation ${featuresOpen ? 'is-open' : ''}`}>
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

        <div className="portal-manager-logout">
          <button
            type="button"
            onClick={onLogout}
            className="w-full btn-secondary justify-center text-xs py-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto min-w-0">
        
        {/* DASHBOARD HOME */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            
            <div className="manager-desktop-overview">{managerOverview}</div>

            {/* Institutional demand-to-waste recommendation */}
            <section className="card-clean overflow-hidden" aria-labelledby="demand-forecast-title">
              <header className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <Activity className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h3 id="demand-forecast-title" className="text-sm font-extrabold text-slate-900">Meal demand and waste planning</h3>
                    <p className="mt-1 text-xs text-slate-500">Explainable baseline using seven demo attendance days. Not a trained ML model.</p>
                  </div>
                </div>
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
                  {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => { setSelectedCookMeal(meal); setOperationMessage(''); }}
                      className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold capitalize ${selectedCookMeal === meal ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-white'}`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </header>

              <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-1 text-xs font-semibold text-slate-700">
                  <span>Today&apos;s mess-offs</span>
                  <input
                    type="number"
                    min="0"
                    max={activeResidents}
                    value={messOffCounts[selectedCookMeal]}
                    onChange={(event) => setMessOffCounts((current) => ({ ...current, [selectedCookMeal]: Math.min(activeResidents, Math.max(0, Number(event.target.value))) }))}
                    className="w-full"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold text-slate-700">
                  <span>Calendar adjustment</span>
                  <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="w-full">
                    <option value="normal">Regular day</option>
                    <option value="event">Campus event (+8%)</option>
                    <option value="holiday">Holiday (-12%)</option>
                  </select>
                </label>
                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Meal feedback</span>
                  <span className="mt-1 block text-lg font-extrabold text-slate-900">{feedbackRatings[selectedCookMeal].toFixed(1)} / 5</span>
                  <span className="text-[10px] text-slate-500">Demo aggregate rating</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Participation history</span>
                  <span className="mt-1 block text-lg font-extrabold text-slate-900">{demandForecast.recentAverage} recent / {demandForecast.historicalAverage} avg.</span>
                  <span className="text-[10px] text-slate-500">Last 3 days weighted more</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-100 lg:grid-cols-4">
                <div className="bg-white p-4">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Expected demand</span>
                  <span className="mt-1 block text-2xl font-extrabold text-blue-800">{demandForecast.expectedDemand}</span>
                  <span className="text-[10px] text-slate-500">Predicted diners</span>
                </div>
                <div className="bg-white p-4">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Historical range</span>
                  <span className="mt-1 block text-2xl font-extrabold text-slate-800">{demandForecast.lowerBound}–{demandForecast.upperBound}</span>
                  <span className="text-[10px] text-slate-500">Based on attendance variation</span>
                </div>
                <div className="bg-white p-4">
                  <span className="block text-[10px] font-bold uppercase text-slate-500">Available residents</span>
                  <span className="mt-1 block text-2xl font-extrabold text-orange-700">{demandForecast.availableResidents}</span>
                  <span className="text-[10px] text-slate-500">112 enrolled minus mess-offs</span>
                </div>
                <div className="bg-emerald-50 p-4">
                  <span className="block text-[10px] font-bold uppercase text-emerald-800">Recommended prep</span>
                  <span className="mt-1 block text-2xl font-extrabold text-emerald-900">{demandForecast.recommendedPortions}</span>
                  <span className="text-[10px] text-emerald-800">Includes 3% service buffer</span>
                </div>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Utensils className="h-4 w-4 text-emerald-700" />Preparation plan</h4>
                  <label className="block space-y-1 text-xs font-semibold text-slate-700">
                    <span>Prepared quantity (portions)</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={prepQuantities[selectedCookMeal] ?? currentMealOperation.prepared ?? demandForecast.recommendedPortions}
                      onChange={(event) => setPrepQuantities((current) => ({ ...current, [selectedCookMeal]: event.target.value === '' ? '' : Number(event.target.value) }))}
                      className="w-full"
                    />
                  </label>
                  <button type="button" onClick={handleApprovePrep} className="btn-primary w-full justify-center text-xs">
                    <CheckCircle2 className="h-4 w-4" /> Approve preparation quantity
                  </button>
                  {currentMealOperation.prepApproved && <p className="text-xs font-semibold text-emerald-700">Approved: {currentMealOperation.prepared} portions</p>}
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900"><TrendingDown className="h-4 w-4 text-emerald-700" />After-service actuals</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1 text-xs font-semibold text-slate-700">
                      <span>Consumed portions</span>
                      <input type="number" min="0" step="1" value={consumedInput} onChange={(event) => setActualConsumedInputs((current) => ({ ...current, [selectedCookMeal]: event.target.value }))} className="w-full" />
                    </label>
                    <label className="space-y-1 text-xs font-semibold text-slate-700">
                      <span>Wasted portions</span>
                      <input type="number" min="0" step="1" value={wasteInput} onChange={(event) => setWasteInputs((current) => ({ ...current, [selectedCookMeal]: event.target.value }))} className="w-full" />
                    </label>
                  </div>
                  <p className="text-xs text-slate-600">Unserved after meal: {consumedInput === '' ? 'Enter actual consumption' : Math.max(0, preparedInput - Number(consumedInput))} portions</p>
                  <button type="button" onClick={handleRecordMealOutcome} className="btn-secondary w-full justify-center text-xs">
                    Save meal outcome
                  </button>
                </div>
              </div>

              {operationMessage && <p role="status" className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700">{operationMessage}</p>}
              {currentMealOperation.outcomeRecordedAt && (
                <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
                  Last saved: {currentMealOperation.prepared} prepared, {currentMealOperation.consumed} consumed, {currentMealOperation.remaining} remaining, {currentMealOperation.waste} wasted. {currentMealOperation.outcomeRecordedAt}
                </div>
              )}
            </section>

            {/* ── 4 Quick Action Tiles ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* QR Scanner */}
              <div
                onClick={() => setActiveTab('qr-attendance')}
                className="card-clean p-4 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-emerald-600 font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <ScanLine className="w-4 h-4" />
                    <span>QR Scanner</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <span className="text-[11px] text-slate-500 block mb-1">Live Counter Scans</span>
                <span className="text-2xl font-extrabold text-slate-900 block">0 / 112</span>
                <span className="text-[11px] text-orange-600 font-semibold mt-1 block">0.0% Turnout</span>
              </div>

              {/* Mess-Offs */}
              <div
                onClick={() => setActiveTab('mess-offs')}
                className="card-clean p-4 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-orange-600 font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4" />
                    <span>Mess-Offs</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <span className="text-[11px] text-slate-500 block mb-1">Exemptions / Opt-Outs</span>
                <span className="text-2xl font-extrabold text-slate-900 block">6</span>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">₹300 Rebate Pending</span>
              </div>

              {/* Grievances */}
              <div
                onClick={() => setActiveTab('complaints')}
                className="card-clean p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-blue-600 font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Grievances</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-[11px] text-slate-500 block mb-1">Pending Complaints</span>
                <span className="text-2xl font-extrabold text-slate-900 block">1</span>
                <span className="text-[11px] text-orange-600 font-semibold mt-1 block">Hostel 4 Students</span>
              </div>

              {/* Orders Desk */}
              <div
                onClick={() => setActiveTab('counter')}
                className="card-clean p-4 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-purple-600 font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Orders Desk</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <span className="text-[11px] text-slate-500 block mb-1">Special Food Orders</span>
                <span className="text-lg font-extrabold text-slate-900 block">Live Desk</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Egg Roll, Chowmein, Burger</span>
              </div>
            </div>

            {/* ── Birthday Banner ── */}
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed"><strong>Student Birthday Recognition:</strong> Today is <strong>Rahul Kumar's</strong> birthday (Room 204)! Flagged on Cashier Panel for complimentary sweet treat.</span>
              </div>
              <span className="badge badge-amber shrink-0 self-start sm:self-auto">Offer Treat 🍩</span>
            </div>

          </div>
        )}

        {/* QR ATTENDANCE TAB */}
        {activeTab === 'qr-attendance' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">QR Attendance Scanner</h3>
                <p className="text-xs text-slate-600">Real-time student meal entry log. Each QR scan marks attendance and adjusts headcount.</p>
              </div>
              <span className="badge badge-emerald py-1.5 px-3 self-start text-xs font-semibold">Live Counter Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-clean p-5 bg-emerald-50/60 border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">Scanned In</span>
                <span className="text-4xl font-extrabold text-emerald-700 block">0</span>
                <span className="text-xs text-emerald-600 mt-1 block">of 112 students</span>
              </div>
              <div className="card-clean p-5 bg-amber-50/60 border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2">Pending Entry</span>
                <span className="text-4xl font-extrabold text-amber-700 block">112</span>
                <span className="text-xs text-amber-600 mt-1 block">Awaiting scan</span>
              </div>
              <div className="card-clean p-5 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Turnout Rate</span>
                <span className="text-4xl font-extrabold text-slate-700 block">0%</span>
                <span className="text-xs text-slate-500 mt-1 block">Live session progress</span>
              </div>
            </div>

            <div className="card-clean p-5 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl">
                <QrCode className="w-12 h-12 text-emerald-400" />
                <div className="text-white">
                  <span className="font-bold text-sm block">QR Scanner Active</span>
                  <span className="text-xs text-slate-400">Point student's mess card QR at camera. Each scan auto-logs meal attendance.</span>
                </div>
                <button className="btn-primary text-xs py-2 px-4 ml-auto cursor-pointer">Simulate Scan</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Meal</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr><td className="p-3" colSpan={5}><span className="text-slate-400 italic">No scans yet — session starting shortly...</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT ATTENDANCE TAB */}
        {activeTab === 'student-attendance' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Student Attendance</h3>
              <p className="text-xs text-slate-600">Full meal attendance log for all resident students. Filter by hostel block or meal shift.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[{label:'Present Today', val:'104', color:'emerald'},{label:'Absent (Mess-Off)',val:'6',color:'amber'},{label:'Avg Attendance',val:'91%',color:'blue'},{label:'Total Enrolled',val:'112',color:'slate'}].map((stat,i)=>(
                <div key={i} className="card-clean p-4 text-center">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide block mb-1">{stat.label}</span>
                  <span className={`text-2xl font-extrabold block text-${stat.color}-700`}>{stat.val}</span>
                </div>
              ))}
            </div>
            <div className="card-clean p-5 overflow-x-auto">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Today's Attendance Roster</h4>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student</th><th className="p-3">Room</th><th className="p-3">Breakfast</th><th className="p-3">Lunch</th><th className="p-3">Dinner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {name:'Rahul Kumar',room:'Buddha - 204',b:'✓',l:'✓',d:'—'},
                    {name:'Pooja Kumari',room:'Gargi - 112',b:'✓',l:'Off',d:'✓'},
                    {name:'Amit Patel',room:'Buddha - 305',b:'—',l:'✓',d:'✓'},
                    {name:'Sneha Roy',room:'Gargi - 108',b:'✓',l:'✓',d:'✓'},
                    {name:'Vikram Singh',room:'Aryabhatta - 402',b:'—',l:'✓',d:'—'},
                  ].map((r,i)=>(
                    <tr key={i}>
                      <td className="p-3 font-bold text-slate-900">{r.name}</td>
                      <td className="p-3 text-slate-500">{r.room}</td>
                      <td className="p-3"><span className={r.b==='✓'?'text-emerald-600 font-bold':r.b==='Off'?'text-amber-600 font-bold':'text-slate-400'}>{r.b}</span></td>
                      <td className="p-3"><span className={r.l==='✓'?'text-emerald-600 font-bold':r.l==='Off'?'text-amber-600 font-bold':'text-slate-400'}>{r.l}</span></td>
                      <td className="p-3"><span className={r.d==='✓'?'text-emerald-600 font-bold':r.d==='Off'?'text-amber-600 font-bold':'text-slate-400'}>{r.d}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESS-OFFS TAB */}
        {activeTab === 'mess-offs' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mess-Off / Exemptions Management</h3>
                <p className="text-xs text-slate-600">Review and approve student mess-off requests. Approved leaves auto-adjust kitchen headcount.</p>
              </div>
              <span className="badge badge-amber py-1.5 px-3 self-start text-xs font-semibold">6 Active Exemptions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-clean p-4 bg-amber-50/60 border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block mb-1">This Week's Off</span>
                <span className="text-2xl font-extrabold text-amber-700">6</span>
                <span className="text-xs text-amber-600 block mt-1">Students on meal leave</span>
              </div>
              <div className="card-clean p-4 bg-emerald-50/60 border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block mb-1">Rebate to Process</span>
                <span className="text-2xl font-extrabold text-emerald-700">₹300</span>
                <span className="text-xs text-emerald-600 block mt-1">Auto-deducted from dues</span>
              </div>
              <div className="card-clean p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Meals Saved</span>
                <span className="text-2xl font-extrabold text-slate-800">18</span>
                <span className="text-xs text-slate-500 block mt-1">Waste reduction impact</span>
              </div>
            </div>
            <div className="card-clean overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Current Mess-Off Applications</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  {name:'Pooja Kumari',room:'Gargi - 112',from:'29 Sept',to:'30 Sept',reason:'Lab assignment',status:'Approved'},
                  {name:'Suman Roy',room:'Buddha - 401',from:'1 Oct',to:'4 Oct',reason:'Festival leave (Dussehra)',status:'Approved'},
                  {name:'Kiran Mehta',room:'Gargi - 210',from:'30 Sept',to:'30 Sept',reason:'Family function',status:'Pending'},
                  {name:'Ravi Prasad',room:'Aryabhatta - 116',from:'2 Oct',to:'5 Oct',reason:'Medical rest',status:'Pending'},
                ].map((r,i)=>(
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{r.name} — <span className="font-normal text-slate-500">{r.room}</span></span>
                      <span className="text-slate-500">Off: {r.from} → {r.to} • Reason: {r.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`badge text-[10px] ${r.status==='Approved'?'badge-emerald':'badge-amber'}`}>{r.status}</span>
                      {r.status === 'Pending' && (
                        <button className="btn-primary text-[10px] py-1 px-3 cursor-pointer">Approve</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOD PREP TAB */}
        {activeTab === 'food-prep' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Food Prep & Cooking</h3>
              <p className="text-xs text-slate-600">Kitchen preparation checklist and cook assignment for today's meals.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Breakfast','Lunch','Dinner'].map((meal,i)=>(
                <div key={i} className="card-clean p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{meal}</h4>
                    <span className={`badge text-[10px] ${i===0?'badge-emerald':i===1?'badge-amber':'badge-slate'}`}>
                      {i===0?'Completed':i===1?'In Progress':'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {(i===0?['✓ Aloo Paratha (380 plates)','✓ Curd portioned (38 KG)','✓ Masala Tea (80L)']:i===1?['⏳ Rice cooking (120 KG)','⏳ Dal tadka (90L)','⏳ Shahi Paneer (65 KG)']:['— Chapati (420 pcs pending)','— Matar Paneer','— Gulab Jamun']).map((item,j)=>(
                      <div key={j} className={`text-xs p-2 rounded-lg ${item.startsWith('✓')?'bg-emerald-50 text-emerald-800':item.startsWith('⏳')?'bg-amber-50 text-amber-800':'bg-slate-50 text-slate-600'}`}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WASTAGE MONITOR TAB */}
        {activeTab === 'wastage' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Wastage Monitor</h3>
              <p className="text-xs text-slate-600">Track daily food wastage in real-time. Compare against previous weeks to measure improvement.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[{label:'Today\'s Wastage',val:'1.8 KG',sub:'30% less than last week',color:'emerald'},{label:'This Week',val:'14.2 KG',sub:'Across all meals',color:'blue'},{label:'Waste per Meal',val:'0.6 KG',sub:'Per serving session',color:'slate'},{label:'Savings Impact',val:'₹1,280',sub:'Estimated cost saved',color:'emerald'}].map((s,i)=>(
                <div key={i} className="card-clean p-4">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide block mb-1">{s.label}</span>
                  <span className={`text-2xl font-extrabold text-${s.color}-700 block`}>{s.val}</span>
                  <span className="text-[11px] text-slate-500 block mt-1">{s.sub}</span>
                </div>
              ))}
            </div>
            <div className="card-clean p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Wastage by Meal Shift (This Week)</h4>
              <div className="space-y-3">
                {[{meal:'Breakfast',val:4.2,max:10},{meal:'Lunch',val:7.1,max:10},{meal:'Dinner',val:2.9,max:10}].map((w,i)=>(
                  <div key={i} className="flex items-center gap-4 text-xs">
                    <span className="w-20 font-semibold text-slate-700">{w.meal}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width:`${(w.val/w.max)*100}%`}} />
                    </div>
                    <span className="font-bold text-slate-800 w-12 text-right">{w.val} KG</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SURPLUS LISTING AND FOOD SAFETY TAB */}
        {activeTab === 'surplus' && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Surplus food and safety review</h3>
              <p className="text-xs text-slate-600">Only unserved portions not recorded as waste can be listed. A manager must verify applicable handling and quality requirements.</p>
            </header>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
              <form onSubmit={handleCreateSurplusListing} className="card-clean space-y-4 p-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">Verify and list surplus</h4>
                </div>

                {eligibleSurplusMeals.length === 0 ? (
                  <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">No eligible surplus recorded. Save a meal outcome from the dashboard first; remaining portions already logged as waste cannot be listed.</p>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-xs font-semibold text-slate-700">
                        <span>Source meal outcome</span>
                        <select value={selectedSurplusMeal} onChange={(event) => setSurplusMeal(event.target.value)} className="w-full">
                          {eligibleSurplusMeals.map(([meal]) => <option key={meal} value={meal}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</option>)}
                        </select>
                      </label>
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <span className="block text-[10px] font-bold uppercase text-emerald-800">Potential portions before verification</span>
                        <span className="mt-1 block text-xl font-extrabold text-emerald-900">{eligibleSurplusQuantity}</span>
                      </div>
                    </div>

                    <label className="block space-y-1 text-xs font-semibold text-slate-700">
                      <span>Food item</span>
                      <input type="text" value={surplusFoodName} onChange={(event) => setSurplusFoodName(event.target.value)} placeholder="e.g. Cooked rice and dal" className="w-full" />
                    </label>

                    <label className="block max-w-sm space-y-1 text-xs font-semibold text-slate-700">
                      <span>Food category</span>
                      <select value={surplusFoodCategory} onChange={(event) => setSurplusFoodCategory(event.target.value)} className="w-full">
                        <option value="vegetarian">Vegetarian</option>
                        <option value="non-vegetarian">Non-vegetarian</option>
                        <option value="packaged">Packaged / sealed</option>
                      </select>
                    </label>

                    <label className="block space-y-1 text-xs font-semibold text-slate-700">
                      <span>Pickup location</span>
                      <input type="text" value={surplusLocation} onChange={(event) => setSurplusLocation(event.target.value)} className="w-full" />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-xs font-semibold text-slate-700">
                        <span>Prepared at</span>
                        <input type="datetime-local" value={surplusPreparedAt} onChange={(event) => setSurplusPreparedAt(event.target.value)} className="w-full" />
                      </label>
                      <label className="space-y-1 text-xs font-semibold text-slate-700">
                        <span>Available until</span>
                        <input type="datetime-local" value={surplusAvailableUntil} onChange={(event) => setSurplusAvailableUntil(event.target.value)} className="w-full" />
                      </label>
                    </div>

                    <label className="block max-w-xs space-y-1 text-xs font-semibold text-slate-700">
                      <span>Measured storage temperature (°C)</span>
                      <input type="number" step="0.1" value={surplusTemperature} onChange={(event) => setSurplusTemperature(event.target.value)} placeholder="Record measured value" className="w-full" />
                    </label>

                    <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-bold text-amber-950">Required manual checks</p>
                      <label className="flex items-start gap-2 text-xs text-amber-950">
                        <input type="checkbox" checked={surplusSafetyVerified} onChange={(event) => setSurplusSafetyVerified(event.target.checked)} className="mt-0.5" />
                        <span>I verified preparation time, storage temperature, and handling against applicable food-safety rules.</span>
                      </label>
                      <label className="flex items-start gap-2 text-xs text-amber-950">
                        <input type="checkbox" checked={surplusQualityVerified} onChange={(event) => setSurplusQualityVerified(event.target.checked)} className="mt-0.5" />
                        <span>I inspected food quality and confirm it is suitable to offer for redistribution.</span>
                      </label>
                      <p className="text-[11px] text-amber-900">The prototype records these checks but does not determine food safety automatically.</p>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center text-xs">
                      <ShieldCheck className="h-4 w-4" /> Verify and list for pickup
                    </button>
                  </>
                )}
                {surplusMessage && <p role="status" className="rounded-lg bg-slate-50 p-3 text-xs font-semibold text-slate-700">{surplusMessage}</p>}
              </form>

              <section className="space-y-3" aria-labelledby="surplus-listings-title">
                <div className="flex items-center justify-between">
                  <h4 id="surplus-listings-title" className="text-sm font-bold text-slate-900">Surplus listings</h4>
                  <span className="text-xs text-slate-500">{surplusListings.length} total</span>
                </div>
                {surplusListings.length === 0 ? (
                  <div className="card-clean p-5 text-xs text-slate-600">No food has been listed. Verified listings will appear here.</div>
                ) : surplusListings.map((listing) => {
                  const receiverMatches = findEligibleReceivers(listing, REDISTRIBUTION_RECEIVERS);
                  const nextStatuses = {
                    Requested: ['Accepted', 'Available'],
                    Accepted: ['Pickup scheduled', 'Available'],
                    'Pickup scheduled': ['Delivered'],
                    Delivered: ['Completed'],
                    Completed: []
                  }[listing.status] || [];
                  return (
                    <article key={listing.id} className="card-clean space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{listing.foodName}</h5>
                          <p className="mt-1 text-xs text-slate-600">{listing.quantity} portions · {listing.sourceMeal} · {listing.foodCategory || 'Uncategorized'} · {listing.location}</p>
                        </div>
                        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">Safety checks recorded</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Prepared {new Date(listing.preparedAt).toLocaleString()} · {listing.temperatureC}°C · Available until {new Date(listing.availableUntil).toLocaleString()}</p>

                      {listing.status === 'Available' ? (
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <p className="text-xs font-bold text-slate-800">Matching receivers <span className="font-normal text-slate-500">(demo service zones, food type, and capacity)</span></p>
                          {receiverMatches.length === 0 ? (
                            <p className="text-xs text-slate-600">No eligible receiver matched this listing and pickup window.</p>
                          ) : receiverMatches.map((receiver) => (
                            <div key={receiver.id} className="flex flex-col gap-2 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-900">{receiver.name}</p>
                                <p className="text-[11px] text-slate-600">Service area: {receiver.serviceZones.join(', ')} · Capacity: {receiver.maxPortions} portions</p>
                              </div>
                              <button type="button" onClick={() => handleRequestSurplusPickup(listing.id, receiver)} className="btn-primary justify-center text-xs">
                                Request pickup
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <p className="text-xs text-slate-700">Receiver: <span className="font-bold">{listing.receiverName || 'Not assigned'}</span></p>
                          {listing.pickupWindow && <p className="text-[11px] text-slate-600">Pickup {new Date(listing.pickupWindow).toLocaleString()} · {listing.handoffMethod === 'provider-delivery' ? 'Provider delivery' : 'Receiver pickup'} · {listing.transportMode} · Contact {listing.pickupContactName} ({listing.pickupContactPhone})</p>}
                          <label className="block space-y-1 text-xs font-semibold text-slate-700">
                            <span>Redistribution status</span>
                            <select value={listing.status} onChange={(event) => handleUpdateSurplusStatus(listing.id, event.target.value)} className="w-full">
                              <option value={listing.status}>{listing.status}</option>
                              {nextStatuses.map((status) => <option key={status} value={status}>{status === 'Available' ? 'Release back to available' : status}</option>)}
                            </select>
                          </label>
                          <p className="text-[11px] text-slate-500">Request and delivery states are demo-tracked manually; no partner notification or route is sent.</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>
            </div>
          </div>
        )}

        {/* MEAL BILLING COUNTER & RECEIPTS TAB */}
        {activeTab === 'counter' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Meal Billing Counter & Receipts</h3>
              <p className="text-xs text-slate-600">Select a meal type, print receipt token, and trigger audio chime for walk-in guests.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Meal Selector */}
              <div className="card-clean p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Select Meal for Guest / Casual Diner</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Breakfast', price: breakfastPrice, type: 'Breakfast Plate' },
                    { label: 'Lunch Thali', price: lunchPrice, type: 'Lunch Thali' },
                    { label: 'Evening Snacks', price: snacksPrice, type: 'Evening Snacks' },
                    { label: 'Special Dinner', price: dinnerPrice, type: 'Special Dinner' },
                  ].map(m => (
                    <button
                      key={m.type}
                      onClick={() => { setCounterMealType(m.type); setCounterPrice(m.price); }}
                      className={`p-4 border-2 rounded-xl font-bold cursor-pointer transition-all text-center ${
                        counterMealType === m.type
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="block text-sm">{m.label}</span>
                      <span className="block text-base font-extrabold mt-1 text-slate-900">₹{m.price}</span>
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">💡 Counter Guidelines:</p>
                  <p>Walk-in tokens are instantly synced with daily cash collections and trigger a pleasant speaker chime at the counter.</p>
                </div>
              </div>

              {/* Receipt Preview Card - Button directly below receipt paper, no downwards shift */}
              <div className="card-clean p-5 bg-slate-900 text-white space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-emerald-400" />
                    Thermal Receipt Preview
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">58mm Roll</span>
                </div>

                {/* Receipt Slip Container */}
                <div className="bg-slate-800 rounded-xl p-4 font-mono text-xs space-y-1.5 border border-slate-700">
                  <p className="text-emerald-400 font-bold text-center border-b border-slate-700 pb-2">SMART MESS — Sabour Campus</p>
                  <div className="pt-1 space-y-1 text-slate-300">
                    <div className="flex justify-between"><span>Item:</span> <span className="text-white font-bold">{counterMealType}</span></div>
                    <div className="flex justify-between"><span>Price:</span> <span className="text-emerald-400 font-bold">₹{counterPrice}</span></div>
                    <div className="flex justify-between"><span>Counter:</span> <span className="text-slate-200">Gate 1 — Central Mess A</span></div>
                    <div className="flex justify-between"><span>Date:</span> <span className="text-slate-200">28 Sept 2026, 1:05 PM</span></div>
                  </div>
                  <p className="text-slate-400 text-center border-t border-slate-700 pt-2 mt-2 text-[11px]">Thank you! Enjoy your meal.</p>
                </div>

                {/* Print Button - placed right below the receipt paper */}
                <button
                  onClick={handlePrintReceipt}
                  className="btn-primary w-full justify-center cursor-pointer text-xs py-2.5 shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Receipt & Sound Chime
                </button>

                {receiptPrinted && (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-lg p-2 text-center text-xs font-semibold flex items-center justify-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Receipt Printed & Audio Chime Played!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY & WASTE LOG TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Live Inventory & Leftover Monitor</h3>
              <p className="text-xs text-slate-600">Track raw grocery stock levels and log daily kitchen leftover weight in KG.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-clean p-4 border-emerald-300 bg-emerald-50/30">
                <span className="text-xs font-bold text-slate-700 block">Basmati Rice Stock</span>
                <span className="text-xl font-extrabold text-emerald-700">420 KG</span>
                <span className="text-[11px] text-emerald-800 font-semibold block mt-1">Sufficient for 12 Days</span>
              </div>

              <div className="card-clean p-4 border-amber-300 bg-amber-50/40">
                <span className="text-xs font-bold text-amber-900 block">Yellow Dal Stock</span>
                <span className="text-xl font-extrabold text-amber-700">35 KG</span>
                <span className="text-[11px] text-amber-800 font-bold block mt-1">⚠ Low Stock — Reorder Soon</span>
              </div>

              <div className="card-clean p-4">
                <span className="text-xs font-bold text-slate-700 block">Today's Leftover Log</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">1.8 KG</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">30% Less Waste Than Last Week</span>
              </div>
            </div>
          </div>
        )}

        {/* WHATSAPP PAYMENT ALERTS TAB */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">WhatsApp Payment Reminders</h3>
              <p className="text-xs text-slate-600">Send polite, pre-formatted balance alerts directly to students' WhatsApp to collect dues 3x faster.</p>
            </div>

            {whatsAppSent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold">
                ✓ WhatsApp reminder sent to {selectedStudentForWA}!
              </div>
            )}

            <div className="card-clean p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Overdue Dues Roster</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Room</th>
                      <th className="p-3">Amount Due</th>
                      <th className="p-3">Days Overdue</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {pendingDuesList.map((st, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold">{st.name}</td>
                        <td className="p-3 text-slate-600">{st.room}</td>
                        <td className="p-3 font-bold text-red-600">{st.due}</td>
                        <td className="p-3 text-slate-500">{st.daysOverdue} Days</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => { setSelectedStudentForWA(st.name); handleSendWhatsAppReminder(); }}
                            className="btn-primary text-xs py-1 px-3 cursor-pointer inline-flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Send
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* KITCHEN EXPENSE LOG TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Kitchen & Operations Expense Log</h3>
              <p className="text-xs text-slate-600">Record daily kitchen costs — groceries, fuel, equipment, and supplies.</p>
            </div>
            <form onSubmit={handleAddExpense} className="card-clean p-5 space-y-3 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900">Add New Expense</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="What was purchased? (e.g. LPG Cylinder)" value={expenseItem} onChange={(e) => setExpenseItem(e.target.value)} className="text-xs" />
                <input type="number" placeholder="Amount (₹)" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="text-xs" />
              </div>
              <button type="submit" className="btn-primary text-xs cursor-pointer">Log Expense</button>
            </form>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Today's Expense Log</h4>
              {expenses.map((ex) => (
                <div key={ex.id} className="card-clean p-3.5 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{ex.item}</span>
                    <span className="text-slate-500 text-[11px]">{ex.category} • {ex.date}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">₹{ex.amount}</span>
                </div>
              ))}
              <div className="card-clean p-3 bg-emerald-50/40 border-emerald-200 flex justify-between text-xs font-bold mt-2">
                <span className="text-slate-700">Total Recorded Today</span>
                <span className="text-emerald-700 text-sm">₹{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* MEAL TIMINGS & ACCESS TAB */}
        {activeTab === 'shifts' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Meal Timings & Gate Access</h3>
              <p className="text-xs text-slate-600">Set serving windows. Gates auto-lock when shift ends.</p>
            </div>

            {shiftSaved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
                ✓ Timings saved! Gate readers updated automatically.
              </div>
            )}

            <form onSubmit={handleSaveShifts} className="card-clean p-6 space-y-4 max-w-lg">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Breakfast Time Slot:</label>
                <input type="text" value={breakfastTime} onChange={(e) => setBreakfastTime(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Lunch Time Slot:</label>
                <input type="text" value={lunchTime} onChange={(e) => setLunchTime(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Dinner Time Slot:</label>
                <input type="text" value={dinnerTime} onChange={(e) => setDinnerTime(e.target.value)} className="text-xs" />
              </div>

              <button type="submit" className="btn-primary text-xs py-2.5 cursor-pointer">
                <Clock className="w-4 h-4" /> Save Meal Timings
              </button>
            </form>
          </div>
        )}

        {/* MEAL PRICING SETUP TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Meal Pricing Setup</h3>
              <p className="text-xs text-slate-600">Set per-meal prices for walk-in guests and non-subscription plates.</p>
            </div>

            {pricesSaved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold">
                ✓ Prices saved! Bill counter terminal updated.
              </div>
            )}

            <form onSubmit={handleSavePrices} className="card-clean p-6 space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Breakfast (₹):</label>
                  <input type="number" value={breakfastPrice} onChange={(e) => setBreakfastPrice(Number(e.target.value))} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Lunch Thali (₹):</label>
                  <input type="number" value={lunchPrice} onChange={(e) => setLunchPrice(Number(e.target.value))} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Evening Snacks (₹):</label>
                  <input type="number" value={snacksPrice} onChange={(e) => setSnacksPrice(Number(e.target.value))} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Dinner (₹):</label>
                  <input type="number" value={dinnerPrice} onChange={(e) => setDinnerPrice(Number(e.target.value))} className="text-xs" />
                </div>
              </div>

              <button type="submit" className="btn-primary text-xs py-2.5 cursor-pointer">
                <Sliders className="w-4 h-4" /> Save Prices
              </button>
            </form>
          </div>
        )}

        {/* DAILY COOKING QUANTITY TAB */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Daily Cooking Quantity Plan</h3>
                <p className="text-xs text-slate-600">Calculates exact meal plates and kitchen groceries based on live mess-off attendance.</p>
              </div>
              
              {/* Shift Selector */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
                {[
                  { id: 'breakfast', label: 'Breakfast (380 Plates)' },
                  { id: 'lunch', label: 'Lunch (410 Plates)' },
                  { id: 'dinner', label: 'Dinner (420 Plates)' }
                ].map((shift) => (
                  <button
                    key={shift.id}
                    onClick={() => setSelectedCookMeal(shift.id)}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      selectedCookMeal === shift.id 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {shift.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-clean p-5 bg-emerald-50/60 border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Enrolled Hostel Residents</span>
                <span className="text-3xl font-extrabold text-slate-900 block">450</span>
                <span className="text-xs text-slate-600 mt-1 block">Buddha Block resident capacity</span>
              </div>

              <div className="card-clean p-5 bg-amber-50/60 border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  {selectedCookMeal === 'breakfast' ? 'Skipping Breakfast' : selectedCookMeal === 'dinner' ? 'Skipping Dinner' : 'Skipping Lunch'}
                </span>
                <span className="text-3xl font-extrabold text-amber-700 block">
                  {selectedCookMeal === 'breakfast' ? '70' : selectedCookMeal === 'dinner' ? '30' : '40'}
                </span>
                <span className="text-xs text-amber-700 mt-1 block">Student mess-off leaves submitted</span>
              </div>

              <div className="card-clean p-5 bg-blue-50/60 border-blue-200">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">Target Cooking Count</span>
                <span className="text-3xl font-extrabold text-blue-900 block">
                  {selectedCookMeal === 'breakfast' ? '380' : selectedCookMeal === 'dinner' ? '420' : '410'}
                </span>
                <span className="text-xs text-blue-700 mt-1 block">Zero-waste target plates</span>
              </div>
            </div>

            {/* 2-Column Well Arranged Elements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Column 1: Cooked Meal Dishes & Quantities */}
              <div className="card-clean p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    Cooked Batch Breakdown ({selectedCookMeal.toUpperCase()})
                  </h4>
                  <span className="badge badge-emerald text-[10px]">Headcount Ready</span>
                </div>

                <div className="space-y-2.5">
                  {(selectedCookMeal === 'breakfast' ? [
                    { dish: 'Aloo Paratha', prepQty: '760 Pcs (2 pcs / student)', vessel: 'Hot Storage Tawa 1 & 2' },
                    { dish: 'Fresh Curd / Dahi', prepQty: '40 KG portioned', vessel: 'Chilled Storage' },
                    { dish: 'Special Pickle & Butter', prepQty: '12 KG', vessel: 'Dispenser Counters' },
                    { dish: 'Milk & Masala Tea', prepQty: '80 Litres', vessel: 'Insulated Urns' }
                  ] : selectedCookMeal === 'dinner' ? [
                    { dish: 'Matar Paneer Curry', prepQty: '68 KG Cooked Gravy', vessel: 'Steam Cauldron 1' },
                    { dish: 'Dal Makhani', prepQty: '85 Litres', vessel: 'Steam Cauldron 2' },
                    { dish: 'Steamed Jeera Rice', prepQty: '110 KG Cooked', vessel: 'Rice Warmer 1 & 2' },
                    { dish: 'Fresh Tawa Roti', prepQty: '1,260 Pcs (3 pcs / student)', vessel: 'Thermal Box' },
                    { dish: 'Gulab Jamun Sweet', prepQty: '420 Pcs', vessel: 'Dessert Tray' }
                  ] : [
                    { dish: 'Steamed Basmati Rice', prepQty: '120 KG Cooked', vessel: 'Rice Cauldrons 1 & 2' },
                    { dish: 'Toor Dal Tadka', prepQty: '90 Litres', vessel: 'Boiler Cauldron 3' },
                    { dish: 'Shahi Paneer / Mixed Veg', prepQty: '65 KG Cooked Gravy', vessel: 'Main Pan A' },
                    { dish: 'Whole Wheat Phulka Roti', prepQty: '1,230 Pcs (3 pcs / student)', vessel: 'Insulated Thermal Box' },
                    { dish: 'Bundi Raita & Fresh Salad', prepQty: '45 Litres', vessel: 'Cold Storage Container' }
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.dish}</span>
                        <span className="text-[11px] text-slate-500">{item.vessel}</span>
                      </div>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                        {item.prepQty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Raw Grocery Store Requisition */}
              <div className="card-clean p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Raw Grocery Requisition from Store
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">Synced with Stock</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(selectedCookMeal === 'breakfast' ? [
                    { name: 'Wheat Atta', req: '42 KG', stock: '250 KG', status: 'Sufficient' },
                    { name: 'Boiled Potatoes', req: '35 KG', stock: '80 KG', status: 'Ready' },
                    { name: 'Fresh Milk', req: '65 Litres', stock: '80 L', status: 'Ready' },
                    { name: 'Tea Leaves & Sugar', req: '6 KG', stock: '30 KG', status: 'Sufficient' }
                  ] : selectedCookMeal === 'dinner' ? [
                    { name: 'Basmati Rice', req: '45 KG', stock: '420 KG', status: 'Sufficient' },
                    { name: 'Paneer & Green Peas', req: '32 KG', stock: '40 KG', status: 'Ready' },
                    { name: 'Urad Dal & Rajma', req: '16 KG', stock: '120 KG', status: 'Sufficient' },
                    { name: 'Wheat Atta', req: '38 KG', stock: '250 KG', status: 'Sufficient' },
                    { name: 'Refined Oil / Ghee', req: '7.5 L', stock: '60 L', status: 'Sufficient' },
                    { name: 'Sweet Ingredients', req: '14 KG', stock: '35 KG', status: 'Ready' }
                  ] : [
                    { name: 'Basmati Rice', req: '49.2 KG', stock: '420 KG', status: 'Sufficient' },
                    { name: 'Toor Dal Raw', req: '14.3 KG', stock: '180 KG', status: 'Sufficient' },
                    { name: 'Wheat Atta', req: '36.8 KG', stock: '250 KG', status: 'Sufficient' },
                    { name: 'Fresh Paneer', req: '28.5 KG', stock: '35 KG', status: 'Ready' },
                    { name: 'Cooking Oil', req: '8.2 L', stock: '60 L', status: 'Sufficient' },
                    { name: 'Fresh Curd / Dahi', req: '41 KG', stock: '50 KG', status: 'Ready' },
                    { name: 'Onions & Tomatoes', req: '22 KG', stock: '90 KG', status: 'Sufficient' },
                    { name: 'Spice Masala Mix', req: '4.1 KG', stock: '25 KG', status: 'Sufficient' }
                  ]).map((ing, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{ing.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                          {ing.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>Need: <strong className="text-slate-900">{ing.req}</strong></span>
                        <span>Stock: {ing.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Chef Handover & Kitchen Staff Notes */}
            <div className="card-clean p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Head Cook Handover Note</span>
                  <span className="text-slate-400 text-[11px]">
                    Serving window: 12:30 PM – 02:30 PM • Keep 20 buffer plates ready in warming trays for walk-in students.
                  </span>
                </div>
              </div>
              <span className="badge badge-emerald py-1 px-3 shrink-0">Kitchen Plan Verified ✓</span>
            </div>

          </div>
        )}

        {/* WEEKLY MENU PLANNER TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Weekly Menu Planner</h3>
                <p className="text-xs text-slate-600">Plan meals for the week with balanced nutrition and taste.</p>
              </div>
              <button className="btn-primary text-xs py-1.5 px-3 cursor-pointer self-start sm:self-auto">
                + Add Special Dish
              </button>
            </div>

            <div className="space-y-3">
              {weeklyMenuPlan.map((m, idx) => (
                <div key={idx} className="card-clean p-4 text-xs grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                  <span className="font-extrabold text-slate-900 text-sm md:pt-1">{m.day}</span>
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-0.5">Breakfast</span>
                    <span className="text-slate-800 font-medium">{m.breakfast}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-0.5">Lunch</span>
                    <span className="text-slate-800 font-medium">{m.lunch}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-0.5">Dinner</span>
                    <span className="text-slate-800 font-medium">{m.dinner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENT RATINGS TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Meal Ratings & Feedback Analytics</h3>
                <p className="text-xs text-slate-600">Aggregated ratings submitted by resident students after each meal to guide tomorrow's preparation.</p>
              </div>
              <span className="badge badge-emerald self-start sm:self-auto py-1 px-3 text-xs font-semibold">
                Live Rating Feed ✓
              </span>
            </div>

            {/* Top Rating Scorecards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-clean p-5 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Overall Mess Rating</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">4.6</span>
                  <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] text-emerald-800 font-semibold ml-1">94% Positive</span>
                </div>
              </div>

              <div className="card-clean p-5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Ratings Logged</span>
                <span className="text-3xl font-extrabold text-slate-900 block">2,254</span>
                <span className="text-[11px] text-slate-500 mt-1 block">Verified student reviews</span>
              </div>

              <div className="card-clean p-5 border-emerald-200 bg-emerald-50/30">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Top Rated Dish</span>
                <span className="text-base font-extrabold text-slate-900 block truncate">Litti Chokha & Sattu</span>
                <span className="text-[11px] text-emerald-700 font-bold mt-1 block">4.9 ★ (420 Votes)</span>
              </div>

              <div className="card-clean p-5 border-amber-200 bg-amber-50/30">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Needs Improvement</span>
                <span className="text-base font-extrabold text-slate-900 block truncate">Seasonal Mix Veg</span>
                <span className="text-[11px] text-amber-700 font-bold mt-1 block">3.2 ★ (Recipe Review)</span>
              </div>
            </div>

            {/* Dish-wise Rating Cards */}
            <div className="card-clean p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Dish-wise Performance & Student Feedback
                </h4>
                <span className="text-xs text-slate-500">Updated after each meal shift</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ITEM_RATINGS.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 transition-all">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{item.dish}</h5>
                        <span className="text-[11px] text-slate-500 font-medium">{item.category} • {item.votes} Votes</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-extrabold text-slate-900 text-sm">{item.rating}</span>
                          <span className="text-[11px] text-slate-400 font-semibold">/ 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Sentiment */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="badge badge-emerald text-[10px]">{item.sentiment}</span>
                        <span className="text-slate-600 font-mono">{Math.round((item.rating / 5) * 100)}% Satisfaction</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.rating >= 4.5 ? 'bg-emerald-600' : item.rating >= 4.0 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(item.rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Student Feedback Quote */}
                    {item.feedback && (
                      <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                        "{item.feedback}"
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENT ISSUES DESK TAB */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Student Complaints & Issues Desk</h3>
              <p className="text-xs text-slate-600">Review and resolve complaints raised by students. Aim to resolve within 24 hours.</p>
            </div>

            <div className="space-y-3">
              {managerComplaints.map((c) => (
                <div key={c.id} className="card-clean p-4 text-xs space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">{c.issue}</span>
                      <span className="text-[11px] text-slate-500">Ticket {c.id} • {c.student}, Room {c.room}</span>
                    </div>
                    <select 
                      value={c.status} 
                      onChange={(e) => handleUpdateTicketStatus(c.id, e.target.value)}
                      className="text-xs py-1 px-2 border rounded-lg bg-white font-bold shrink-0"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved ✅</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <span>Category: {c.category}</span>
                    <span>Raised: {c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENT MESSAGES INBOX TAB */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Messages Inbox</h3>
                <p className="text-xs text-slate-600">All messages, complaints, poll responses, and mess-off notices from students.</p>
              </div>
              <span className="badge badge-amber">{studentInboxMessages.filter(m => m.urgent).length} Urgent</span>
            </div>

            <div className="space-y-3">
              {studentInboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`card-clean p-4 text-xs space-y-2 ${msg.urgent ? 'border-amber-300 bg-amber-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {msg.from.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{msg.from}</span>
                        <span className="text-[11px] text-slate-400">{msg.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {msg.urgent && <span className="badge badge-amber text-[10px]">Urgent</span>}
                      <span className="badge badge-emerald text-[10px]">{msg.type}</span>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-10">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEND ANNOUNCEMENT TAB */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Broadcast Announcements to Students</h3>
                <p className="text-xs text-slate-600">Push mess alerts, menu specials, or holiday updates directly to student notification bells and dashboards.</p>
              </div>
              <span className="badge badge-emerald self-start sm:self-auto py-1 px-2.5 text-xs font-semibold">
                Instant Push Live ✓
              </span>
            </div>

            {broadcastSent && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Announcement broadcasted successfully to <strong>{broadcastTarget}</strong>! Instant notification dispatched.</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Compose Announcement Form (5 Cols) */}
              <div className="lg:col-span-5 card-clean p-5 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Compose New Broadcast</h4>
                    <p className="text-[11px] text-slate-500">Sent directly to student devices</p>
                  </div>
                </div>

                <form onSubmit={handleSendBroadcast} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Select Target Audience:</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="text-xs font-medium"
                    >
                      <option value="All Students">All Students (Buddha Hostel - 450 Residents)</option>
                      <option value="Buddha Block">Buddha Block Only (Wing A & B)</option>
                      <option value="Aryabhatta Block">Aryabhatta Block Only</option>
                      <option value="Gargi Girls Hostel">Gargi Girls Hostel</option>
                    </select>
                  </div>

                  {/* Quick Preset Templates */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 block">Quick Template Presets:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Holiday Notice', text: 'Mess will remain closed on 2nd Oct (Gandhi Jayanti). Packed lunch packets will be distributed at counter from 11:30 AM.' },
                        { label: 'Special Dish', text: 'Today for dinner: Special Hot Gulab Jamun & Shahi Paneer! Service begins promptly at 8:00 PM.' },
                        { label: 'Water Maintenance', text: 'Kitchen boiler undergoing routine pipeline cleaning between 3 PM - 4 PM. Evening tea served on schedule.' }
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setBroadcastMsg(preset.text)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors cursor-pointer border border-slate-200"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 block">Message Content *</label>
                      {broadcastMsg && (
                        <button
                          type="button"
                          onClick={() => setBroadcastMsg('')}
                          className="text-[11px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Clear Text
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Type your official announcement here... Keep it concise for student mobile screens."
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      required
                      className="w-full border-2 border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed transition-all shadow-inner resize-y min-h-[120px]"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
                      <span className="font-mono">{broadcastMsg.length} characters</span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Target: {broadcastTarget}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary text-xs py-2.5 w-full justify-center cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" /> Broadcast Announcement Now
                  </button>
                </form>
              </div>

              {/* Sent Announcements Box (7 Cols) */}
              <div className="lg:col-span-7 card-clean p-5 space-y-4 bg-white border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      Sent Announcements Log
                    </h4>
                    <p className="text-[11px] text-slate-500">History of announcements pushed to student portals</p>
                  </div>
                  <span className="badge badge-emerald text-xs font-bold">
                    {broadcastHistory.length} Broadcasted
                  </span>
                </div>

                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {broadcastHistory.map((b) => (
                    <div 
                      key={b.id} 
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 transition-all hover:border-slate-300 hover:bg-slate-100/50 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-emerald text-[10px] font-bold">{b.target}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{b.sentAt}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteBroadcast(b.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-white transition-colors cursor-pointer"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-slate-800 text-xs font-medium leading-relaxed pl-1 border-l-2 border-emerald-500 py-0.5">
                        {b.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Delivered to student notification bells & dashboards
                        </span>
                        <span className="text-slate-400 font-mono">ID #{b.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MANAGER PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Mess Manager Profile & Credentials</h3>
                <p className="text-xs text-slate-600">Verified catering license & institutional management details</p>
              </div>
              <button className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer">
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" /> Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="card-clean p-6 text-center space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 text-emerald-400 font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-emerald-500">
                  MM
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Rajesh Verma</h4>
                  <p className="text-xs text-slate-500 font-mono">Emp ID: MGR-8802</p>
                  <span className="badge badge-emerald mt-2">Senior Mess In-Charge</span>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 text-left">
                  <p><strong>Assigned Unit:</strong> Central Mess A</p>
                  <p><strong>Campus:</strong> Sabour Main Campus</p>
                  <p><strong>Hostel Block:</strong> Buddha Hostel</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="card-clean p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Compliance & License Info</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">FSSAI Food Safety License</span>
                      <span className="font-mono font-bold text-emerald-700">#20419088274109</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Sanitary Hygiene Rating</span>
                      <span className="font-bold text-slate-900">4.9 / 5 Grade A+</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Contract Validity</span>
                      <span className="font-bold text-slate-800">Valid till March 2028</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Daily Staff Capacity</span>
                      <span className="font-semibold text-slate-800">14 Cooks & Server Staff</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Official Email</span>
                      <span className="font-mono text-slate-800">mess.manager.sabour@biharinstitute.edu.in</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Emergency Helpline</span>
                      <span className="font-mono font-semibold text-slate-800">+91 98352 11094</span>
                    </div>
                  </div>
                </div>

                <div className="card-clean p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 block">Institutional Audit Status</span>
                    <span className="text-slate-300">100% Compliant with Campus Food Safety Guidelines</span>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
