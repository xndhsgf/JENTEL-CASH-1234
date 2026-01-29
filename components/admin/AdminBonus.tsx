
import React, { useState, useMemo } from 'react';
import { UserState, Product, Order } from '../../types';
import { Search, Gift, Zap, ShieldCheck, UserCheck, Package, RefreshCw, CheckCircle2, History, User, Coins } from 'lucide-react';

interface AdminBonusProps {
  allUsers: UserState[];
  products: Product[];
  orders: Order[];
  onGiveBonus: (userEmail: string, productId: number, coins: number) => Promise<void>;
}

const AdminBonus: React.FC<AdminBonusProps> = ({ allUsers, products, orders, onGiveBonus }) => {
  const [targetId, setTargetId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 0);
  const [coinsAmount, setCoinsAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // البحث عن المستخدم والمنتج
  const foundUser = useMemo(() => allUsers.find(u => u.id === targetId), [allUsers, targetId]);
  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

  // سجل العمليات مرتب تنازلياً
  const bonusHistory = useMemo(() => {
    return orders
      .filter(o => o.type === 'admin_bonus')
      .map(bonusOrder => {
        const u = allUsers.find(user => user.email.toLowerCase() === bonusOrder.userId.toLowerCase());
        return { ...bonusOrder, user: u };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, allUsers]);

  const handleSubmit = async () => {
    if (!foundUser) return alert("يرجى التأكد من الـ ID الصحيح للمستخدم");
    if (!selectedProduct) return alert("يرجى اختيار منتج");
    const amount = parseInt(coinsAmount);
    if (isNaN(amount) || amount <= 0) return alert("يرجى إدخال كمية كوينز صحيحة");

    setIsSubmitting(true);
    try {
      await onGiveBonus(foundUser.email, selectedProduct.id, amount);
      setSuccessMsg(`تم منح بونص بقيمة ${amount} كوينز لـ ${foundUser.name} بنجاح!`);
      setTargetId('');
      setCoinsAmount('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e) {
      alert("حدث خطأ أثناء عملية رفع البونص");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 rtl" dir="rtl">
      {successMsg && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-in slide-in-from-top-2">
           <CheckCircle2 size={24} />
           <p className="text-xs font-black">{successMsg}</p>
        </div>
      )}

      {/* البحث عن المستخدم */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-slate-800">1. تحديد العميل</h4>
           <UserCheck size={18} className="text-blue-500"/>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="أدخل الـ ID التسلسلي (مثال: 10452)"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 text-center font-black text-slate-700 outline-none focus:border-blue-500"
          />
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>

        {foundUser && (
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100 animate-in zoom-in-95">
             <div className="text-right flex-1">
                <h5 className="font-black text-xs text-blue-900">{foundUser.name}</h5>
                <p className="text-[10px] font-black text-blue-500 uppercase">ID: {foundUser.id}</p>
             </div>
             <img src={foundUser.profilePic} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm" alt=""/>
          </div>
        )}
      </div>

      {/* تفاصيل البونص */}
      <div className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 transition-opacity ${!foundUser ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-slate-800">2. اختيار المنتج ورفع البونص</h4>
           <Gift size={18} className="text-rose-500"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 mr-2 uppercase text-right">المنتج المرتبط</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
                className="w-full h-12 bg-slate-50 rounded-2xl px-6 text-right font-black outline-none border border-slate-100 focus:border-rose-500 appearance-none text-slate-700"
              >
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
           </div>

           <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between border border-white/5">
              <div className="text-right">
                 <p className="text-[9px] font-black text-white/40 uppercase">الكمية الحالية</p>
                 <p className="text-sm font-black text-yellow-400">{selectedProduct?.amount.toLocaleString()} كوينز</p>
              </div>
              <Coins size={20} className="text-yellow-400" />
           </div>
        </div>

        <div className="space-y-1">
           <label className="block text-[10px] font-black text-slate-400 mr-2 uppercase text-right">المبلغ المراد رفعه (Bonus)</label>
           <div className="relative">
             <input 
               type="number" 
               placeholder="0"
               value={coinsAmount}
               onChange={(e) => setCoinsAmount(e.target.value)}
               className="w-full h-16 bg-slate-50 rounded-2xl px-6 text-center font-black text-2xl text-slate-900 outline-none border border-slate-100 focus:border-rose-500"
             />
             <Zap size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500" />
           </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !foundUser}
          className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? <RefreshCw className="animate-spin" size={24}/> : <><Gift size={24}/> رفع البونص الآن</>}
        </button>
      </div>

      {/* سجل العمليات الاحترافي */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-slate-800">آخر عمليات رفع البونص</h4>
           <History size={18} className="text-slate-400"/>
        </div>

        <div className="space-y-3">
           {bonusHistory.length > 0 ? bonusHistory.slice(0, 10).map((bonus) => (
             <div key={bonus.id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="text-left">
                   <p className="text-[10px] font-black text-emerald-600">+{bonus.coinsAmount.toLocaleString()} كوينز</p>
                   <p className="text-[8px] text-slate-400 font-bold">{new Date(bonus.date).toLocaleString('ar-EG')}</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-xs font-black text-slate-800">{bonus.user?.name || 'مستخدم'}</p>
                      <span className="text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded">ID: {bonus.user?.id || 'N/A'}</span>
                   </div>
                   <img src={bonus.user?.profilePic} className="w-10 h-10 rounded-xl object-cover" alt=""/>
                </div>
             </div>
           )) : (
             <div className="py-10 text-center opacity-30 text-xs font-bold">لا توجد سجلات بونص حالية</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminBonus;
