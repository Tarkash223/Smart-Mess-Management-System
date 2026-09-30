// Real-world Indian Hostel Mess Sample Data (Bihar & All-India Context)

export const SAMPLE_INSTITUTION = {
  name: "Bihar Institute of Technology & Science",
  campus: "Sabour Main Campus, Bhagalpur",
  state: "Bihar",
  country: "India",
  totalHostels: 4,
  totalStudents: 1840,
  activeMesses: 4
};

export const HOSTELS_LIST = [
  { id: "H1", name: "Buddha Block (Hostel 1)", campus: "Sabour Campus, Bhagalpur", warden: "Dr. S. K. Verma", students: 480, messUnit: "Central Mess A" },
  { id: "H2", name: "Nalanda Hall (Hostel 2)", campus: "Patna Campus", warden: "Prof. R. P. Sinha", students: 520, messUnit: "Central Mess B" },
  { id: "H3", name: "Chanakya Hostel (Hostel 3)", campus: "Muzaffarpur Campus", warden: "Dr. Anita Roy", students: 420, messUnit: "Hostel 3 Mess" },
  { id: "H4", name: "Aryabhata Block (Hostel 4)", campus: "Gaya Campus", warden: "Prof. Manish Kumar", students: 420, messUnit: "Hostel 4 Mess" }
];

export const DEMO_STUDENT = {
  id: "STD-2026-801",
  name: "Rahul Kumar",
  rollNo: "2104082",
  branch: "Computer Science",
  institution: "Bihar Institute of Technology, Sabour",
  hostel: "Buddha Block (Hostel 1)",
  roomNo: "304",
  messUnit: "Central Mess A",
  nfcCardId: "NFC-8849-IN",
  mealCredits: 58,
  messOffActive: false
};

export const NOTICES = [
  {
    id: 1,
    title: "🎉 Wednesday Litti-Chokha Feast Day!",
    category: "Special Meal",
    date: "Today, 28 Sept",
    content: "Desi Ghee Litti Chokha served in lunch today with chilled Sattu Drink! Enjoy the authentic taste of Bihar.",
    urgent: true
  },
  {
    id: 2,
    title: "📝 Mid-Term Exam Mess-Off Window Open",
    category: "Mess Off",
    date: "26 Sept 2026",
    content: "Students going home for exam leave can apply for mess-off till 10:00 PM tonight for automated headcount adjustment.",
    urgent: false
  },
  {
    id: 3,
    title: "🌱 Waste Reduction Milestone Achieved!",
    category: "Impact",
    date: "25 Sept 2026",
    content: "Food wastage dropped by 30% this week thanks to accurate student demand predictions!",
    urgent: false
  }
];

export const TODAY_MENU = {
  date: "Wednesday, 28 September",
  breakfast: {
    title: "Breakfast",
    time: "7:30 AM - 9:30 AM",
    items: [
      { name: "Poha with Peanuts & Sev", category: "Veg", calories: "260 kcal" },
      { name: "Boiled Eggs / Fresh Banana", category: "Protein", calories: "140 kcal" },
      { name: "Hot Tea & Milk", category: "Beverage", calories: "90 kcal" }
    ],
    expectedDiners: 365,
    predictedDemand: 360,
    recommendedPortions: 365,
    status: "Served"
  },
  lunch: {
    title: "Lunch",
    time: "12:30 PM - 2:30 PM",
    items: [
      { name: "Steamed Rice & Chapati", category: "Staple", calories: "320 kcal" },
      { name: "Yellow Dal Tadka", category: "Veg", calories: "160 kcal" },
      { name: "Seasonal Mix Sabzi", category: "Veg", calories: "130 kcal" },
      { name: "Fresh Curd & Salad", category: "Side", calories: "80 kcal" }
    ],
    expectedDiners: 410,
    predictedDemand: 398,
    recommendedPortions: 400,
    status: "In Preparation"
  },
  snacks: {
    title: "Evening Snacks",
    time: "5:00 PM - 6:00 PM",
    items: [
      { name: "Upma & Green Chutney", category: "Veg", calories: "180 kcal" },
      { name: "Hot Masala Chai", category: "Beverage", calories: "80 kcal" }
    ],
    expectedDiners: 310,
    predictedDemand: 300,
    recommendedPortions: 305,
    status: "Upcoming"
  },
  dinner: {
    title: "Dinner",
    time: "8:00 PM - 10:00 PM",
    items: [
      { name: "Paneer Butter Masala", category: "Veg Deluxe", calories: "340 kcal" },
      { name: "Jeera Rice & Tandoori Roti", category: "Staple", calories: "290 kcal" },
      { name: "Yellow Dal Fry", category: "Veg", calories: "150 kcal" },
      { name: "Kheer / Sweet Dish", category: "Dessert", calories: "190 kcal" }
    ],
    expectedDiners: 380,
    predictedDemand: 345,
    recommendedPortions: 350,
    status: "Upcoming"
  }
};

export const ITEM_RATINGS = [
  { 
    id: 1,
    dish: "Special Litti Chokha & Sattu", 
    category: "Wednesday Lunch", 
    rating: 4.9, 
    votes: 420, 
    sentiment: "Top Rated Favorite ⭐", 
    stars: [85, 12, 3, 0, 0],
    feedback: "Authentic sattu filling, roasted perfectly with desi ghee and baingan chokha."
  },
  { 
    id: 2,
    dish: "Paneer Butter Masala & Roti", 
    category: "Dinner Special", 
    rating: 4.6, 
    votes: 342, 
    sentiment: "High Demand", 
    stars: [72, 18, 7, 2, 1],
    feedback: "Rich creamy gravy, paneer cubes were soft and fresh."
  },
  { 
    id: 3,
    dish: "Aloo Paratha with Curd & Butter", 
    category: "Breakfast", 
    rating: 4.5, 
    votes: 380, 
    sentiment: "Popular Breakfast", 
    stars: [68, 22, 6, 3, 1],
    feedback: "Crispy tawa parathas with fresh white butter."
  },
  { 
    id: 4,
    dish: "Yellow Dal Tadka & Jeera Rice", 
    category: "Daily Lunch", 
    rating: 4.2, 
    votes: 512, 
    sentiment: "Consistent & Homely", 
    stars: [55, 30, 10, 4, 1],
    feedback: "Homely aroma, ghee jeera tadka was well balanced."
  },
  { 
    id: 5,
    dish: "Rajma Masala with Steamed Rice", 
    category: "Sunday Lunch", 
    rating: 4.4, 
    votes: 310, 
    sentiment: "Student Favorite", 
    stars: [62, 24, 10, 3, 1],
    feedback: "Thick Punjabi rajma gravy with hot basmati rice."
  },
  { 
    id: 6,
    dish: "Seasonal Mix Veg Gravy", 
    category: "Dinner", 
    rating: 3.2, 
    votes: 290, 
    sentiment: "Recipe Review Recommended", 
    stars: [20, 25, 30, 15, 10],
    feedback: "Veggies slightly overcooked. Students requested more paneer or capsicum."
  }
];

export const FEATURES_LIST = [
  {
    id: 1,
    title: "Five connected operational modules",
    desc: "Use one platform for institutional kitchens, catering, food businesses, processing units, and surplus receivers.",
    badge: "Platform",
    sector: "Shared platform",
    icon: "Layers"
  },
  {
    id: 2,
    title: "Institutional demand and prep planning",
    desc: "Use meal attendance history, mess-offs, feedback, and calendar adjustments to estimate diners and recommend preparation quantities.",
    badge: "Institutional kitchens",
    sector: "Institutional kitchens",
    icon: "Activity"
  },
  {
    id: 3,
    title: "Meal participation, feedback, and outcomes",
    desc: "Track meal participation and record prepared, consumed, remaining, and wasted portions alongside meal ratings and complaints.",
    badge: "Operational tracking",
    sector: "Institutional kitchens",
    icon: "ClipboardCheck"
  },
  {
    id: 4,
    title: "Safety-reviewed surplus listings",
    desc: "Require food details, preparation and availability times, storage readings, and human safety and quality checks before listing surplus.",
    badge: "Safety prerequisite",
    sector: "Surplus network",
    icon: "ShieldCheck"
  },
  {
    id: 5,
    title: "Receiver matching and requests",
    desc: "Suggest eligible receivers using configured service zones, accepted food categories, availability windows, and portion capacity.",
    badge: "Eligibility matching",
    sector: "NGOs and food receivers",
    icon: "HandHeart"
  },
  {
    id: 6,
    title: "Pickup coordination and receipt confirmation",
    desc: "Coordinate multi-stop pickups with contacts, time windows, transport mode, a mapped route estimate, and receiver-confirmed quantities.",
    badge: "Shared logistics",
    sector: "Redistribution network",
    icon: "MapPin"
  },
  {
    id: 7,
    title: "Cafeteria and catering event planning",
    desc: "Record event date, venue, guests, event type, and menu; estimate demand from comparable completed events or an event-type baseline.",
    badge: "Event demand planning",
    sector: "Cafeteria and catering",
    icon: "Calendar"
  },
  {
    id: 8,
    title: "Event outcomes and food feedback",
    desc: "Compare recommended preparation with item-level prepared, consumed, surplus, and waste quantities, then record organizer ratings.",
    badge: "Post-event tracking",
    sector: "Cafeteria and catering",
    icon: "ClipboardList"
  },
  {
    id: 9,
    title: "Item-wise food business forecasts",
    desc: "Estimate orders by product, day, and service period from recorded sales history, with a manager baseline when history is limited.",
    badge: "Sales-based planning",
    sector: "Food businesses",
    icon: "ShoppingBag"
  },
  {
    id: 10,
    title: "Ingredient requirement estimates",
    desc: "Attach optional per-order recipes to food items and estimate raw-material quantities from a recommended preparation count.",
    badge: "Recipe-based estimates",
    sector: "Food businesses",
    icon: "Boxes"
  },
  {
    id: 11,
    title: "Unsold food and item analytics",
    desc: "Record prepared, sold, unsold, redistributed, and wasted quantities; review popularity, overproduction, and recent sales and waste trends.",
    badge: "Item performance",
    sector: "Food businesses",
    icon: "TrendingDown"
  },
  {
    id: 12,
    title: "Production batch efficiency",
    desc: "Compare planned and actual raw-material use and output; review yield variance, shortfall, machine downtime, and resource readings.",
    badge: "Batch analytics",
    sector: "Food processing units",
    icon: "Factory"
  },
  {
    id: 13,
    title: "Storage monitoring and threshold alerts",
    desc: "Compare temperature and humidity readings with operator-configured process ranges; simulated device controls exercise alert workflows.",
    badge: "Configured ranges",
    sector: "Food processing units",
    icon: "Thermometer"
  },
  {
    id: 14,
    title: "Human-reviewed visual quality workflow",
    desc: "Preview batch images, record visual observations, and set QA disposition. Findings shown in the interface do not come from image inference or certify safety.",
    badge: "Human QA review",
    sector: "Food processing units",
    icon: "Eye"
  },
  {
    id: 15,
    title: "Cross-sector impact reporting",
    desc: "Read local operational records by sector, keep unlike units separate, count receiver-confirmed handoffs, and show optional sourced impact estimates.",
    badge: "Evidence-based totals",
    sector: "Platform administration",
    icon: "BarChart3"
  }
];

export const COMPLAINTS_DATA = [
  { id: "TKT-104", student: "Aditya Singh", room: "204-A", issue: "Chapati served cold during Monday dinner", category: "Food Quality", status: "Resolved", date: "26 Sept" },
  { id: "TKT-108", student: "Priya Kumari", room: "112-B", issue: "Request for extra curd portion in afternoon lunch", category: "Menu", status: "Under Review", date: "27 Sept" }
];
