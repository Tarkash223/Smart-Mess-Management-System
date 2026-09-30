import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationModal from './components/NotificationModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Public Pages
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import HowItWorksPage from './components/HowItWorksPage';
import SolutionsPage from './components/SolutionsPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';

// Role Dashboards
import StudentPortal from './components/StudentPortal';
import ManagerPortal from './components/ManagerPortal';
import AdminPortal from './components/AdminPortal';
const ReceiverPortal = lazy(() => import('./components/ReceiverPortal'));
const CateringPortal = lazy(() => import('./components/CateringPortal'));
const BusinessPortal = lazy(() => import('./components/BusinessPortal'));
const ProcessingPortal = lazy(() => import('./components/ProcessingPortal'));
const PlatformImpactPortal = lazy(() => import('./components/PlatformImpactPortal'));
const ImpactPage = lazy(() => import('./components/ImpactPage'));
import { X } from 'lucide-react';

function MainApp() {
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState('home'); // Public Home page by default
  const [currentUser, setCurrentUser] = useState(null); // Unauthenticated by default
  
  // Notification Modal & Alert Banner State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showTopNoticeBanner, setShowTopNoticeBanner] = useState(true);

  // Notification Seen / Read Tracking State
  const [readManagerMsgIds, setReadManagerMsgIds] = useState([]);
  const [readCampusNoticeIds, setReadCampusNoticeIds] = useState([]);

  // Dark Mode State with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('smartmess_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('smartmess_dark_mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Calculate dynamic unread notification count
  const isManager = currentUser?.role === 'manager';
  const totalCount = isManager ? 6 : 3;
  const currentReadIds = isManager ? readManagerMsgIds : readCampusNoticeIds;
  const unreadCount = currentUser ? Math.max(0, totalCount - currentReadIds.length) : 0;
  const isAuthenticatedPortal = activePage === 'portal' && Boolean(currentUser);
  const isNetworkOperationsPortal = isAuthenticatedPortal && ['receiver', 'catering', 'business', 'processing', 'platformAdmin'].includes(currentUser.role);

  const handleMarkAsRead = (id) => {
    if (isManager) {
      setReadManagerMsgIds(prev => prev.includes(id) ? prev : [...prev, id]);
    } else {
      setReadCampusNoticeIds(prev => prev.includes(id) ? prev : [...prev, id]);
    }
  };

  const handleMarkAllAsRead = () => {
    if (isManager) {
      setReadManagerMsgIds([1, 2, 3, 4, 5, 6]);
    } else {
      setReadCampusNoticeIds([1, 2, 3]);
    }
  };

  const handleLoginSuccess = async (userSession) => {
    const { ensureDemoPlatformData } = await import('./data/demoPlatformData');
    ensureDemoPlatformData();
    setCurrentUser(userSession);
    setActivePage('portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans transition-colors" style={{backgroundColor: darkMode ? '#0b1120' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#1e293b'}}>
      
      {/* Top Campus Announcement Banner (Shown ONLY after Login) */}
      {currentUser && !isNetworkOperationsPortal && showTopNoticeBanner && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs py-2 px-4 shadow-xs">
          <div className="mx-auto flex w-full min-w-0 flex-col items-stretch gap-2 sm:max-w-7xl sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="badge bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">
                {t('campusNotice')}
              </span>
              <span className="min-w-0 break-words font-semibold text-emerald-50">
                {t('feastDayBanner')}
              </span>
            </div>
            <div className="flex items-center gap-3 self-end sm:shrink-0 sm:self-auto">
              <button 
                onClick={() => setShowTopNoticeBanner(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-950/20 text-emerald-100 transition-colors hover:border-red-200/70 hover:bg-red-500/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                title={t('close')}
                aria-label={t('close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      {!isAuthenticatedPortal && (
        <Navbar 
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => setActivePage('login')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadCount}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 pb-10 overflow-x-hidden">
        
        {/* PUBLIC PAGES */}
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage}
            onOpenLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage 
            onOpenLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'features' && (
          <FeaturesPage />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorksPage />
        )}

        {activePage === 'solutions' && (
          <SolutionsPage 
            onOpenLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'impact' && (
          <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading impact records...</div>}><ImpactPage /></Suspense>
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* AUTHENTICATED ROLE DASHBOARD VIEW */}
        {activePage === 'portal' && (
          currentUser ? (
            <div className="animate-fadeIn">
              {isNetworkOperationsPortal && (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-950">
                  <span className="rounded bg-amber-200 px-2 py-0.5 font-extrabold uppercase">Demo data</span>
                  <span>Simulated records are stored in this browser. Non-empty records are preserved; no live backend, partner sync, or sensor feed is connected.</span>
                </div>
              )}
              {/* Specific Authenticated Role Functionality */}
              {currentUser.role === 'student' && <StudentPortal onLogout={handleLogout} />}
              {currentUser.role === 'manager' && <ManagerPortal onLogout={handleLogout} />}
              {currentUser.role === 'admin' && <AdminPortal onLogout={handleLogout} />}
              {currentUser.role === 'receiver' && <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading receiver workspace...</div>}><ReceiverPortal currentUser={currentUser} onLogout={handleLogout} /></Suspense>}
              {currentUser.role === 'catering' && <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading catering workspace...</div>}><CateringPortal onLogout={handleLogout} /></Suspense>}
              {currentUser.role === 'business' && <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading food business workspace...</div>}><BusinessPortal onLogout={handleLogout} /></Suspense>}
              {currentUser.role === 'processing' && <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading plant workspace...</div>}><ProcessingPortal onLogout={handleLogout} /></Suspense>}
              {currentUser.role === 'platformAdmin' && <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading platform impact analytics...</div>}><PlatformImpactPortal onLogout={handleLogout} /></Suspense>}

            </div>
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        )}

      </main>

      {/* Notification Drawer Modal */}
      {currentUser && (
        <NotificationModal 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          currentUser={currentUser}
          readIds={currentReadIds}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          unreadCount={unreadCount}
        />
      )}

      {/* Footer */}
      {!isNetworkOperationsPortal && <Footer setActivePage={setActivePage} />}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
