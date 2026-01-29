
import React, { useState } from 'react';
import { Order, UserState } from '../../types';
import { 
  ShoppingCart, User as UserIcon, Calendar, CheckCircle, 
  XCircle, Eye, Image as ImageIcon, MessageSquare, Wallet,
  Hash, Zap, Smartphone, UserCheck, ArrowLeftRight, Copy, Check, Activity
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
           <p className="text-sm font-black text-slate-400">لا توجد طلبات معلقة حالياً</p>
        </div>
      )}

      {filteredOrders.map((order) => {
        const user = getUser(order.userId);
        const orderUniqueId = `order-${order.id}`;
        const userUniqueId = `user-${order.id}`;
        
        return (
          <div key={order.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative group transition-all hover:border-rose-200">
            {/* مؤشر الحالة العلوي */}
            <div className={`h-2.5 w-full ${order.status === 'completed' ? 'bg-emerald-500' : order.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'}`} />
            
            <div className="p-6 space-y-5">
              {/* القسم الأول: معلومات المنتج والسعر */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-lg p-0.5">
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
                <div className="text-left bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner">
                  <span className={`text-xl font-black ${typeFilter === 'recharge' ? 'text-emerald-600' : 'text-slate-900'}`}>${order.priceUSD}</span>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mt-1">القيمة</p>
                </div>
              </div>

              {/* القسم الثاني: معلومات اللاعب والعميل */}
              <div className="grid grid-cols-2 gap-4">
                {/* بيانات العميل (صاحب الحساب) */}
                <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex flex-col items-center text-center shadow-sm">
                  <div className="relative mb-2">
                    <img src={user?.profilePic || 'https://picsum.photos/seed/user/50'} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" alt=""/>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-white">
                      <UserCheck size={10} />
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-slate-900 truncate w-full">{user?.name || 'مستخدم'}</span>
                  
                  <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-full mt-1.5 border border-slate-200">
                    <button 
                      onClick={() => copyToClipboard(user?.id || '', userUniqueId)}
                      className={`p-1 rounded-md transition-all ${copiedId === userUniqueId ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-blue-500'}`}
                    >
                      {copiedId === userUniqueId ? <Check size={8} /> : <Copy size={8} />}
                    </button>
                    <span className="text-[9px] font-black text-slate-900">ID: {user?.id || 'N/A'}</span>
                  </div>
                </div>

                {/* المعرف المستهدف (ID اللاعب) */}
                <div className="bg-indigo-50/50 rounded-3xl p-4 border border-indigo-100 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                    <Smartphone size={18} />
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm w-full justify-center">
                    <span className="text-xs font-black text-slate-900 truncate max-w-[80px]">{order.playerId || 'N/A'}</span>
                    <button 
                      onClick={() => copyToClipboard(order.playerId || '', orderUniqueId)}
                      className={`p-1.5 rounded-lg transition-all ${copiedId === orderUniqueId ? 'bg-emerald-500 text-white' : 'text-indigo-400 hover:bg-indigo-50'}`}
                    >
                      {copiedId === orderUniqueId ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-[9px] mt-2 uppercase tracking-tighter">
                    <Zap size={10} />
                    <span>{order.coinsAmount?.toLocaleString()} كوينز</span>
                  </div>
                </div>
              </div>

              {/* قسم المرفقات (في طلبات الإيداع) */}
              {typeFilter === 'recharge' && (
                <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100 flex justify-between items-center shadow-inner">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">المرسل:</p>
                      <p className="text-xs font-black text-slate-900">{order.details?.senderName || 'غير متوفر'}</p>
                   </div>
                   {order.screenshot && (
                     <button 
                       onClick={() => setSelectedImage(order.screenshot!)}
                       className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-md border border-emerald-100 active:scale-90 transition-transform flex items-center gap-2"
                     >
                       <span className="text-[10px] font-black">إثبات</span>
                       <ImageIcon size={18} />
                     </button>
                   )}
                </div>
              )}

              {/* إجراءات الإدارة */}
              {order.status === 'pending' || order.status === 'processing' ? (
                <div className="space-y-4 pt-2">
                  <div className="relative">
                    <textarea 
                      placeholder="أضف ملاحظة أو رد للعميل..." 
                      className="w-full bg-slate-50 rounded-2xl p-4 pr-10 text-xs font-bold text-right outline-none border border-slate-100 focus:border-rose-500 h-20 resize-none transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
                      value={replies[order.id] || ''}
                      onChange={(e) => setReplies({...replies, [order.id]: e.target.value})}
                    />
                    <MessageSquare size={16} className="absolute right-4 top-4 text-slate-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onUpdateOrder(order.id, 'completed', replies[order.id] || 'تم الشحن/الإيداع بنجاح!')}
                      className="bg-slate-900 text-white h-14 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <CheckCircle size={18} className="text-emerald-400" /> تأكيد التنفيذ
                    </button>
                    <button 
                      onClick={() => onUpdateOrder(order.id, 'rejected', replies[order.id] || 'تم رفض الطلب، يرجى مراجعة البيانات')}
                      className="bg-rose-50 text-rose-500 h-14 rounded-2xl font-black text-xs border border-rose-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <XCircle size={18} /> رفض الطلب
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-50">
                   <div className={`w-full py-3 rounded-2xl font-black text-[10px] text-center uppercase tracking-widest ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {order.status === 'completed' ? 'الطلب مكتمل بنجاح ✅' : 'الطلب مرفوض ❌'}
                   </div>
                   {order.adminReply && (
                     <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-800 text-center leading-relaxed">الرد: {order.adminReply}</p>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* نافذة عرض الصور */}
      {selectedImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedImage(null)} />
           <div className="relative max-w-full max-h-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <img src={selectedImage} className="max-w-full max-h-[80vh] object-contain shadow-2xl" alt="Proof"/>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30"
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
