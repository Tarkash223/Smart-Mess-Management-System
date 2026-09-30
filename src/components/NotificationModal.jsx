import React from 'react';
import { Bell, X, Info, Calendar, Sparkles, CheckCircle2, MessageSquare, AlertTriangle, Send, Check, Eye } from 'lucide-react';
import { NOTICES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

// Student messages for Mess Manager
export const STUDENT_MESSAGES_FOR_MANAGER = [
  {
    id: 1,
    studentName: 'Rahul Kumar',
    room: 'Buddha Block - Room 204',
    message: 'Rice was undercooked at lunch today. Please check the steam boiler pressure.',
    category: 'Student Complaint',
    time: 'Today, 2:10 PM',
    urgent: true,
    avatar: 'R'
  },
  {
    id: 2,
    studentName: 'Pooja Kumari',
    room: 'Gargi Block - Room 112',
    message: 'Submitting Mess-Off for tomorrow (29 Sept) dinner due to late microbiology lab.',
    category: 'Mess-Off Notice',
    time: 'Today, 1:45 PM',
    urgent: false,
    avatar: 'P'
  },
  {
    id: 3,
    studentName: 'Amit Patel',
    room: 'Buddha Block - Room 305',
    message: 'Can you please arrange lemon and pickle slices at the lunch distribution counter?',
    category: 'Student Suggestion',
    time: 'Today, 12:30 PM',
    urgent: false,
    avatar: 'A'
  },
  {
    id: 4,
    studentName: 'Sneha Roy',
    room: 'Gargi Block - Room 108',
    message: 'Need light moong dal khichdi today due to mild seasonal fever. Thank you.',
    category: 'Special Diet',
    time: 'Today, 11:15 AM',
    urgent: true,
    avatar: 'S'
  },
  {
    id: 5,
    studentName: 'Vikram Singh',
    room: 'Aryabhatta Block - Room 402',
    message: 'Voted for Paneer Butter Masala in upcoming Sunday special meal poll.',
    category: 'Poll Vote',
    time: 'Today, 10:00 AM',
    urgent: false,
    avatar: 'V'
  },
  {
    id: 6,
    studentName: 'Deepak Sharma',
    room: 'Buddha Block - Room 312',
    message: 'Paid monthly mess dues of ₹2,400 via UPI. Receipt screenshot uploaded.',
    category: 'Fee Payment',
    time: 'Today, 9:20 AM',
    urgent: false,
    avatar: 'D'
  }
];

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  notices = NOTICES,
  readIds = [],
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount = 0
}) {
  const { t, lang } = useLanguage();

  if (!isOpen) return null;

  const isManager = currentUser?.role === 'manager';
  const isAdmin = currentUser?.role === 'admin';
  const items = isManager ? STUDENT_MESSAGES_FOR_MANAGER : notices;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden m-auto relative z-50 animate-scaleUp flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isManager 
                    ? (lang === 'hi' ? 'छात्रों के मैसेज और सूचनाएं' : 'Student Messages & Alerts')
                    : isAdmin 
                      ? (lang === 'hi' ? 'एडमिनिस्ट्रेशन और ऑडिट अलर्ट्स' : 'Administration & Audit Alerts')
                      : (lang === 'hi' ? 'मेस नोटिस और जरूरी अपडेट्स' : 'Campus Mess Notices & Alerts')}
                </h3>
                {unreadCount > 0 ? (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} {lang === 'hi' ? 'बाकी' : 'New'}
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    {lang === 'hi' ? 'सब देखा गया' : 'All Seen'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isManager 
                  ? (lang === 'hi' ? 'छात्रों के सवाल, मेस-ऑफ नोटिस और स्पेशल डाइट रिक्वेस्ट' : 'Incoming student messages, complaints, and diet requests') 
                  : (lang === 'hi' ? 'हॉस्टल मेस बोर्ड के आधिकारिक नोटिस व सूचनाएं' : 'Official hostel mess board announcements & updates')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar for "Mark All as Read" */}
        {unreadCount > 0 && (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 px-5 py-2.5 flex items-center justify-between text-xs">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              💡 {lang === 'hi' ? 'किसी भी नोटिस पर क्लिक करके उसे "देखा गया" मार्क करें' : 'Click any notification or "Mark Seen" to decrement bell count'}
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'सभी पढ़े मार्क करें' : 'Mark All as Read'}
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-3.5 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex-1">
          
          {/* MESS MANAGER VIEW: Student Messages */}
          {isManager ? (
            STUDENT_MESSAGES_FOR_MANAGER.map((m) => {
              const isRead = readIds.includes(m.id);
              return (
                <div 
                  key={m.id} 
                  onClick={() => !isRead && onMarkAsRead(m.id)}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all cursor-pointer relative ${
                    isRead
                      ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-75'
                      : m.urgent 
                        ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 shadow-xs ring-1 ring-amber-400/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                        isRead ? 'bg-slate-400' : 'bg-emerald-600'
                      }`}>
                        {m.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold block ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            {m.studentName}
                          </span>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Unread" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{m.room}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {m.urgent && (
                        <span className="badge badge-amber text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {lang === 'hi' ? 'जरूरी' : 'Urgent'}
                        </span>
                      )}
                      <span className="badge badge-emerald text-[10px]">{m.category}</span>
                      
                      {/* Mark as seen action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(m.id);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                          isRead
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 cursor-default'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 cursor-pointer'
                        }`}
                        title={isRead ? 'Already seen' : 'Click to mark as seen and decrement badge'}
                      >
                        {isRead ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            {lang === 'hi' ? 'देखा गया' : 'Seen'}
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            {lang === 'hi' ? 'देखा मार्क करें' : 'Mark Seen'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed pl-9 p-2 rounded-lg border ${
                    isRead 
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400' 
                      : 'bg-slate-50/80 dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}>
                    {m.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 pl-9">
                    <span>{t('received')}: {m.time}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                      {t('replyInInbox')}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            /* STUDENT & ADMIN VIEW: Campus Notices */
            notices.map((n) => {
              const isRead = readIds.includes(n.id);
              return (
                <div 
                  key={n.id} 
                  onClick={() => !isRead && onMarkAsRead(n.id)}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all cursor-pointer relative ${
                    isRead
                      ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 opacity-75'
                      : n.urgent 
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 shadow-xs ring-1 ring-amber-400/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {n.title}
                      </span>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" title="Unread" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                        {n.date}
                      </span>
                      {/* Mark as seen action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(n.id);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                          isRead
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 cursor-default'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 cursor-pointer'
                        }`}
                        title={isRead ? 'Already seen' : 'Click to mark as seen and decrement badge'}
                      >
                        {isRead ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            {lang === 'hi' ? 'देखा गया' : 'Seen'}
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            {lang === 'hi' ? 'देखा मार्क करें' : 'Mark Seen'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed ${isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {n.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                    <span className="badge badge-emerald text-[10px]">{n.category}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{t('officialBoard')}</span>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3.5 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between px-5 font-medium shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {unreadCount === 0 
                ? (lang === 'hi' ? 'सब पढ़ लिया गया ✓' : 'All caught up ✓') 
                : `${unreadCount} ${lang === 'hi' ? 'नोटिस बिना पढ़े' : 'unread notifications'}`}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold px-3 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
}
