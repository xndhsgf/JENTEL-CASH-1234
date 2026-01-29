
import React, { useState } from 'react';
import { UserState } from '../../types';
import { Search, User as UserIcon, ShieldCheck, Ban, Trash2, Wallet, Star } from 'lucide-react';

interface AdminUsersProps {
  allUsers: UserState[];
  updateAnyUser: (email: string, data: any) => Promise<void>;
  deleteAnyUser: (email: string) => Promise<void>;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ allUsers, updateAnyUser, deleteAnyUser }) => {
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserState | null>(null);

  const filtered = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.includes(search)
  );

  const handleUpdateBalance = async (email: string, current: number, amount: string) => {
    const val = parseFloat(amount);
    if (!isNaN(val)) {
      await updateAnyUser(email, { balanceUSD: current + val });
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="ابحث بالاسم، الإيميل أو ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-right font-bold outline-none focus:border-rose-500"
        />
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="space-y-3">
        {filtered.map(u => (
          <div key={u.email} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button onClick={() => setEditingUser(u)} className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200"><Wallet size={16}/></button>
                <button onClick={() => updateAnyUser(u.email, { isBlocked: !u.isBlocked })} className={`p-2 rounded-xl ${u.isBlocked ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}><Ban size={16}/></button>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <h4 className="font-black text-sm text-slate-800 flex items-center gap-1 justify-end">
                    {u.isVerified && <ShieldCheck size={14} className="text-blue-500"/>} {u.name}
                  </h4>
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                    <span className="bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded font-black">ID: {u.id}</span>
                  </div>
                </div>
                <img src={u.profilePic} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt=""/>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
                <span>${u.balanceUSD.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-black text-[10px] uppercase">
                <Star size={12} fill="currentColor"/>
                <span>VIP {u.vip}</span>
              </div>
            </div>

            {editingUser?.email === u.email && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">تعديل الرصيد (أدخل قيمة سالبة للخصم)</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const amount = prompt("أدخل المبلغ المُراد إضافته أو خصمه:");
                      if (amount) handleUpdateBalance(u.email, u.balanceUSD, amount);
                    }}
                    className="flex-1 h-10 bg-slate-900 text-white rounded-xl font-black text-xs"
                  >
                    تأكيد التعديل
                  </button>
                  <button onClick={() => setEditingUser(null)} className="px-4 h-10 bg-slate-100 text-slate-400 rounded-xl font-black text-xs">إلغاء</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
