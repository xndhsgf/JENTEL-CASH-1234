
import React from 'react';
import { 
  Home, Wallet, ShoppingBag, Users, CreditCard, LogOut, ChevronLeft, Heart, User, ShieldCheck, PlusCircle, Settings
} from 'lucide-react';
import { ViewType, UserState, AppConfig } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewType) => void;
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  appConfig: AppConfig;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, setView, user, setUser, appConfig, onLogout }) => {
  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: <Home size={18} />, color: 'text-green-500' },
    { id: 'recharge', label: 'إضافة رصيد', icon: <CreditCard size={18} />, color: 'text-blue-400' },
    { id: 'orders', label: 'دفعاتي', icon: <ShoppingBag size={18} />, color: 'text-sky-400' },
    { id: 'wallet', label: 'محفظتي', icon: <Wallet size={18} />, color: 'text-yellow-500' },
    { id: 'orders', label: 'طلباتي', icon: <ShoppingBag size={18} />, color: 'text-red-400' },
    { id: 'protection', label: 'الحماية', icon: <ShieldCheck size={18} />, color: 'text-green-400' },
  ];

  if (user.isAdmin) {
    menuItems.push({ id: 'admin', label: 'لوحة التحكم', icon: <Settings size={18} />, color: 'text-indigo-600' });
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] transition-opacity" onClick={onClose} />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-[110] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-6 flex flex-col items-center border-b border-slate-100">
           <div className="w-full flex justify-between items-center mb-6">
             <div className="w-12 h-12">
                <img src={appConfig.logoUrl} alt="App Logo" className="w-full h-full object-contain" />
             </div>
             <button onClick={onClose} className="p-1 text-slate-300">
               <ChevronLeft size={28} />
             </button>
           </div>
           
           <div 
             onClick={() => { setView('profile_edit'); onClose(); }} 
             className="flex flex-col items-center cursor-pointer group"
           >
             <div className="relative mb-3">
               <div className="w-24 h-24 rounded-full border-4 border-[#facc15] overflow-hidden p-1 bg-white shadow-lg group-active:scale-95 transition-all">
                  <img src={user.profilePic} alt="User" className="w-full h-full object-cover rounded-full" />
               </div>
               <div className="absolute bottom-0 right-0 bg-[#facc15] p-1.5 rounded-full border-2 border-white text-white">
                  <User size={12} />
               </div>
             </div>

             <div className="bg-[#f1f5f9] px-3 py-1 rounded-full flex items-center gap-1.5 mb-2">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-[10px] font-black text-slate-700">VIP {user.vip}</span>
             </div>

             <div className="flex flex-col items-center gap-1 mb-1">
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#facc15] transition-colors">{user.name}</h3>
                <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest">ID: {user.id}</span>
             </div>
           </div>

           <div className="flex items-center gap-1.5 mb-4 mt-2">
              <img src="https://flagcdn.com/w20/us.png" className="w-4 h-3 rounded-sm" alt="US" />
              <span className="text-green-600 font-black text-2xl">${user.balanceUSD.toLocaleString()}</span>
           </div>

           <button 
             onClick={() => { setView('recharge'); onClose(); }}
             className="w-full h-10 bg-slate-900 text-white rounded-xl font-black text-[11px] flex items-center justify-center gap-2 mb-6 shadow-md active:scale-95 transition-all"
           >
             <PlusCircle size={16} /> إضافة رصيد
           </button>

           <div className="flex justify-between w-full px-8 mb-4">
              <button className="text-red-500 hover:scale-110 transition-transform"><Heart size={24} /></button>
              <button className="text-slate-800 hover:scale-110 transition-transform" onClick={() => { setView('profile_edit'); onClose(); }}><User size={24} /></button>
              <button className="text-red-600 hover:scale-110 transition-transform" onClick={onLogout} title="تسجيل الخروج">
                <LogOut size={24} />
              </button>
           </div>
        </div>

        <div className="py-2">
          {menuItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => { setView(item.id as ViewType); onClose(); }}
              className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors flex-row-reverse`}
            >
              <div className={item.color}>{item.icon}</div>
              <span className="flex-1 text-right text-sm font-bold text-slate-700">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors flex-row-reverse border-t border-slate-50 mt-2"
          >
            <div className="text-red-500"><LogOut size={18} /></div>
            <span className="flex-1 text-right text-sm font-bold text-red-500">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
