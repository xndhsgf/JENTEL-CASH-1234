
import React from 'react';
import { TrendingUp, Package, Users, RefreshCcw } from 'lucide-react';
import { Order, UserState } from '../../types';

interface AdminStatsProps {
  orders: Order[];
  allUsers: UserState[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ orders, allUsers }) => {
  const totalRecharged = orders.filter(o => o.type === 'recharge' && o.status === 'completed').reduce((sum, o) => sum + o.priceUSD, 0);
  const totalSales = orders.filter(o => o.type === 'product' && o.status === 'completed').reduce((sum, o) => sum + o.priceUSD, 0);

  const stats = [
    { label: 'إيداعات مكتملة', value: `$${totalRecharged.toLocaleString()}`, color: 'bg-emerald-500/10 text-emerald-500', icon: <TrendingUp size={20}/> },
    { label: 'مبيعات المنتجات', value: `$${totalSales.toLocaleString()}`, color: 'bg-rose-500/10 text-rose-500', icon: <Package size={20}/> },
    { label: 'الأعضاء النشطين', value: allUsers.length, color: 'bg-amber-500/10 text-amber-500', icon: <Users size={20}/> },
    { label: 'إجمالي العمليات', value: orders.length, color: 'bg-purple-500/10 text-purple-500', icon: <RefreshCcw size={20}/> },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center transition-transform active:scale-95">
          <div className={`w-12 h-12 rounded-2xl ${stat.color} mb-4 flex items-center justify-center shadow-inner`}>
            {stat.icon}
          </div>
          <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-tight">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
