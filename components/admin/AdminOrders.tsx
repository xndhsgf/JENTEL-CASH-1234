
import React, { useState } from 'react';
import { Order, UserState } from '../../types';
import { 
  ShoppingCart, User as UserIcon, Calendar, CheckCircle, 
  XCircle, Eye, Image as ImageIcon, MessageSquare, Wallet,
  Hash, Zap, Smartphone, UserCheck, ArrowLeftRight, Copy, Check
} from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  allUsers: UserState[];
  onUpdateOrder: (orderId: string, status: 'completed' | 'rejected', reply: string) => void;
  typeFilter: 'product' | 'recharge';
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, allUsers, onUpdateOrder, typeFilter }) => {
  const [replies, setReplies] = useState<{[key: string]: string}>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const filteredOrders = orders.filter(o => o.type === typeFilter);
  const getUser = (email: string) => allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {filteredOrders.length === 0 && (
        <div className="py-20 text-center opacity-40 flex flex-col items-center bg-white rounded-[3rem] border border-dashed border-slate-200">
           {typeFilter === 'recharge' ? <Wallet size={56} className="mb-4 text-slate-300" /> : <ShoppingCart size={56} className="mb-4 text-slate-300" />}
           <p className="text-sm font-black text-slate-400">لا توجد {typeFilter === 'recharge' ? 'طلبات إيداع' : 'طلبات شحن منتجات'} حالياً</p>
        </div>
      )}

      {filteredOrders.map((order) => {
        const user = getUser(order.userId);
        const orderUniqueId = `order-${order.id}`;
        const userUniqueId = `user-${order.id}`;
        
        return (
          <div key={order.id} className="bg-white rounded-[2.5rem] shadow-md border border-slate-100 overflow-hidden relative group transition-all hover:shadow-xl hover:border-rose-100">
            {/* Header Status Bar */}
            <div className={`h-2 w-full ${order.status === 'completed' ? 'bg-emerald-500' : order.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400'}`} />
            
            <div className="p-6 space-y-5">
              {/* Row 1: PRODUCT IMAGE & Price */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-800 shadow-xl p-0.5">
                    {/* عرض صورة المنتج الحقيقية المخزنة مع الطلب */}
                    <img 
                      src={order.productImage || (typeFilter === 'recharge' ? 'https://cdn-icons-png.flaticon.com/512/9402/9402325.png' : 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png')} 
                      className="w-full h-full object-cover rounded-xl" 
                      alt="Product"
                      onError={(e) => {
                        e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png';
                      }}
                    />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-base text-slate-900 leading-tight">{order.productName}</h4>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1 mt-1">
                      {order.date} <Calendar size={10} />
                    </p>
                  </div>
                </div>
                <div className="text-left bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <span className={`text-xl font-black ${typeFilter === 'recharge' ? 'text-emerald-600' : 'text-slate-900'}`}>${order.priceUSD}</span>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">المبلغ</p>
                </div>
              </div>

              {/* Row 2: Customer Site Info & Targeted Player ID with Copy Feature */}
              <div className="grid grid-cols-2 gap-3">
                {/* Site User Info (The sender) */}
                <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex flex-col items-center text-center">
                  <div className="relative mb-2">
                    <img src={user?.profilePic || 'https://picsum.photos/seed/user/50'} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt=""/>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-white">
                      <UserCheck size={10} />
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-slate-800 truncate w-full">{user?.name || 'مجهول'}</span>
                  
                  {/* نسخ ID المستخدم في الموقع */}
                  <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full mt-1 border border-blue-50">
                    <button 
                      onClick={() => copyToClipboard(user?.id || '', userUniqueId)}
                      className={`p-1 rounded-md transition-all ${copiedId === userUniqueId ? 'bg-emerald-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                    >
                      {copiedId === userUniqueId ? <Check size={8} /> : <Copy size={8} />}
                    </button>
                    <span className="text-[9px] font-black">ID: {user?.id || 'N/A'}</span>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">صاحب الطلب</p>
                </div>

                {/* Targeted Player ID for Recharge with Copy Button */}
                <div className="bg-indigo-50/50 rounded-3xl p-4 border border-indigo-100 flex flex-col items-center justify-center text-center relative">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                    <Smartphone size={20} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-1 w-full">
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-indigo-100 shadow-sm w-full justify-center">
                      <span className="text-xs font-black text-indigo-900 truncate max-w-[80px]">{order.playerId || 'N/A'}</span>
                      <button 
                        onClick={() => copyToClipboard(order.playerId || '', orderUniqueId)}
                        className={`p-1.5 rounded-lg transition-all ${copiedId === orderUniqueId ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                        title="نسخ الآي دي"
                      >
                        {copiedId === orderUniqueId ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full mt-1">
                      <Zap size={8} />
                      <span className="text-[9px] font-black">{order.coinsAmount?.toLocaleString() || 0} كوينز</span>
                    </div>
                  </div>
                  <p className="text-[8px] font-bold text-indigo-400 mt-1 uppercase">المعرف المطلوب</p>
                </div>
              </div>

              {/* Extra Details for Recharge (Sender Name & Screenshot) */}
              {typeFilter === 'recharge' && (
                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex justify-between items-center">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">اسم مرسل الحوالة</p>
                      <p className="text-xs font-black text-emerald-900">{order.details?.senderName || 'غير متوفر'}</p>
                   </div>
                   {order.screenshot && (
                     <button 
                       onClick={() => setSelectedImage(order.screenshot!)}
                       className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-md border border-emerald-200 active:scale-90 transition-transform flex items-center gap-2"
                     >
                       <span className="text-[10px] font-black">إثبات</span>
                       <ImageIcon size={18} />
                     </button>
                   )}
                </div>
              )}

              {/* Action Section */}
              {order.status === 'pending' ? (
                <div className="space-y-4 pt-2">
                  <div className="relative">
                    <textarea 
                      placeholder="اكتب ردك للعميل (اختياري)..." 
                      className="w-full bg-slate-50 rounded-2xl p-4 pr-10 text-xs font-bold text-right outline-none border border-slate-100 focus:border-rose-500 h-20 resize-none transition-all placeholder:text-slate-300"
                      value={replies[order.id] || ''}
                      onChange={(e) => setReplies({...replies, [order.id]: e.target.value})}
                    />
                    <MessageSquare size={16} className="absolute right-4 top-4 text-slate-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onUpdateOrder(order.id, 'completed', replies[order.id] || (typeFilter === 'recharge' ? 'تم تأكيد الإيداع' : 'تم شحن طلبك بنجاح'))}
                      className="bg-slate-900 text-white h-14 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <CheckCircle size={18} className="text-emerald-400" /> تأكيد التنفيذ
                    </button>
                    <button 
                      onClick={() => onUpdateOrder(order.id, 'rejected', replies[order.id] || 'عذراً، الطلب مرفوض لمخالفة الشروط أو نقص البيانات')}
                      className="bg-rose-50 text-rose-500 h-14 rounded-2xl font-black text-xs border border-rose-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <XCircle size={18} /> رفض الطلب
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-50">
                   <div className={`w-full py-3 rounded-2xl font-black text-[10px] text-center uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {order.status === 'completed' ? 'الطلب مكتمل بنجاح ✅' : 'تم إلغاء أو رفض الطلب ❌'}
                   </div>
                   {order.adminReply && (
                     <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 text-center italic leading-relaxed">الرد: {order.adminReply}</p>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Lightbox for screenshots */}
      {selectedImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedImage(null)} />
           <div className="relative max-w-full max-h-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <img src={selectedImage} className="max-w-full max-h-[80vh] object-contain" alt="Screenshot"/>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-full"
              >
                <XCircle size={24}/>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
