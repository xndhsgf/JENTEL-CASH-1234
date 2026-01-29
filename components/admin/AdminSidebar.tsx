
import React from 'react';
import { 
  BarChart3, ShoppingCart, Users, Package, 
  LayoutGrid, CreditCard, Settings, X, ShieldCheck, LogOut, Image as ImageIcon, Gift
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose, onLogout }) => {
  const menuItems = [
    { id: 'stats', label: 'الإحصائيات', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'الطلبات', icon: <ShoppingCart size={20} /> },
    { id: 'bonus', label: 'رفع بونص', icon: <Gift size={20} /> }, // الميزة الجديدة
    { id: 'users', label: 'الأعضاء', icon: <Users size={20} /> },
    { id: 'products', label: 'المنتجات', icon: <Package size={20} /> },
    { id: 'categories', label: 'الأقسام', icon: <LayoutGrid size={20} /> },
    { id: 'recharge', label: 'طرق الشحن', icon: <CreditCard size={20} /> },
    { id: 'banners', label: 'البنرات', icon: <ImageIcon size={20} /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[140] backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-64 bg-slate-900 z-[150] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-rose-500" size={24} />
            <span className="text-white font-black text-sm uppercase">لوحة الإدارة</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all flex-row-reverse text-right ${activeTab === item.id ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-xs font-bold">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-rose-500/10 transition-colors flex-row-reverse text-right border-t border-white/5 mt-4"
          >
            <span className="text-rose-500 shrink-0"><LogOut size={20} /></span>
            <span className="flex-1 text-xs font-black text-rose-500">تسجيل الخروج</span>
          </button>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-black/20 text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">JENTEL-CASH ADMIN</p>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
