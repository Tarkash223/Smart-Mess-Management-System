import React, { useState } from 'react';
import { Utensils, Menu, X, ArrowRight, UserCheck, LogOut, Bell, Moon, Sun, Globe, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  currentUser, 
  onLogout, 
  onOpenLogin, 
  onOpenNotifications, 
  unreadCount = 0,
  darkMode,
  onToggleDarkMode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', labelKey: 'home' },
    { id: 'features', labelKey: 'features' },
    { id: 'how-it-works', labelKey: 'howItWorks' },
    { id: 'solutions', labelKey: 'solutions' },
    { id: 'impact', labelKey: 'impact' },
    { id: 'about', labelKey: 'about' },
    { id: 'contact', labelKey: 'contact' }
  ];

  return (
    <header 
      className="site-header sticky top-0 z-50 shadow-xs border-b transition-colors"
      style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
        borderColor: darkMode ? '#1e293b' : '#e2e8f0'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 py-1"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xs">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col justify-center">
            <span 
              className="text-base font-extrabold tracking-tight leading-none whitespace-nowrap"
              style={{ color: darkMode ? '#ffffff' : '#0f172a' }}
            >
              SMART MESS
            </span>
            <span 
              className="text-[11px] font-medium tracking-wide leading-none mt-1 whitespace-nowrap"
              style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              {t('brandTagline')}
            </span>
          </div>
          <span 
            className="sm:hidden text-base font-extrabold"
            style={{ color: darkMode ? '#ffffff' : '#0f172a' }}
          >
            SMART MESS
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-link whitespace-nowrap ${activePage === item.id && activePage !== 'portal' ? 'active' : ''}`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        {/* Right Action Bar: Theme, Language, Notifications, Auth */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          
          {/* Language Switcher Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notification Bell Icon (Rendered ONLY after login) */}
          {currentUser && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Campus Mess Notifications"
            >
              <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 bg-emerald-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Authenticated User Session / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/90 p-1.5 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">{currentUser.role}</span>
                </div>
              </div>

              <button
                onClick={() => setActivePage('portal')}
                className="p-1.5 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                title={t('dashboard')}
                aria-label={t('dashboard')}
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-primary text-xs shrink-0 whitespace-nowrap"
            >
              {t('portalLogin')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

        {/* Mobile Action Controls & Menu Toggle */}
        <div className="flex xl:hidden items-center gap-1.5">
          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            title="Switch Language"
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser && (
            <button
              onClick={() => setActivePage('portal')}
              className="p-1.5 text-emerald-700 dark:text-emerald-400 rounded-lg border border-slate-200 dark:border-slate-700"
              title={t('dashboard')}
              aria-label={t('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Notifications Bell */}
          {currentUser && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <Bell className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1rem] h-[1rem] bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  activePage === item.id 
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {currentUser ? (
              <div>
                <button 
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }} 
                  className="w-full btn-secondary justify-center text-xs py-2"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }} 
                className="w-full btn-primary justify-center text-xs py-2.5"
              >
                {t('portalLogin')}
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
