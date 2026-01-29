
import React from 'react';
import { Search, Package, CheckCircle, Clock, XCircle, MessageSquare, Zap, Terminal, Activity, Hash, ArrowLeftRight } from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  return (
    <div className="p-4 pb-32 animate-in fade-in duration-500 min-h-screen rtl bg-transparent" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span className="text-[10px] font-black text-white">إجمالي العمليات: {orders.length}</span>
         </div>
         <h2 className="text-xl font-black text-white text-right">طلباتي المكتملة والقيد التنفيذ</h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-2xl space-y-5 relative overflow-hidden group border border-white/20">
              {/* شارة الأتمتة المباشرة */}
              {order.status === 'processing' && (
                <div className="absolute top-0 left-0 bg-emerald-500 text-white px-6 py-1 rounded-br-[2rem] flex items-center gap-2 animate-pulse shadow-lg z-10">
                   <Zap size={12} fill="currentColor"/>
                   <span className="text-[8px] font-black uppercase tracking-widest text-white">Direct Link Active</span>
                </div>
              )}

              <div className="flex items-center justify-between relative z-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
                    <img src={order.productImage} className="w-full h-full object-cover" alt=""/>
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-sm text-slate-900 leading-tight">{order.productName}</h4>
                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">#{order.id.slice(0, 8)} | {order.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-slate-900 font-black text-base mb-1">${order.priceUSD.toFixed(2)}</div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-600' : order.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status === 'completed' ? <CheckCircle size={12} /> : order.status === 'rejected' ? <XCircle size={12} /> : <Activity size={12} className="animate-spin" />}
                    <span>{order.status === 'completed' ? 'مكتمل' : order.status === 'rejected' ? 'مرفوض' : 'جاري الربط..'}</span>
                  </div>
                </div>
              </div>

              {/* تفاصيل الطلب بنصوص سوداء داكنة جداً */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center shadow-inner">
                    <p className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest">المعرف المدخل</p>
                    <p className="text-xs font-black text-slate-900 tracking-wider">{order.playerId}</p>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center shadow-inner">
                    <p className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest">كمية الكوينز</p>
                    <p className="text-xs font-black text-slate-900">{order.coinsAmount?.toLocaleString()}</p>
                 </div>
              </div>

              {/* مراقب الربط العالمي (Terminal) بنصوص ملونة على أسود */}
              {order.automationLogs && order.automationLogs.length > 0 && (
                <div className="bg-slate-900 rounded-[1.8rem] p-5 border border-slate-800 space-y-3 shadow-2xl">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1.5 uppercase tracking-widest">
                         <Terminal size={12}/> Universal Connector Logs
                      </span>
                      <div className="flex gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                      </div>
                   </div>
                   <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar font-mono">
                      {order.automationLogs.map((log, i) => (
                        <div key={i} className="flex items-start gap-3 text-right border-b border-white/5 pb-1 last:border-0">
                           <span className="text-[7px] font-mono text-white/20 mt-0.5">[{new Date().toLocaleTimeString('ar-EG', {hour12:false})}]</span>
                           <p className={`text-[9px] font-bold leading-relaxed ${i === order.automationLogs!.length - 1 ? 'text-emerald-400' : 'text-white/60'}`}>
                             {log}
                           </p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* رد الإدارة أو التنبيهات */}
              {order.adminReply && (
                <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 flex gap-4 items-start shadow-sm">
                   <MessageSquare size={18} className="text-white mt-1 shrink-0" />
                   <div className="text-right flex-1">
                      <p className="text-[9px] font-black text-white/40 mb-1 uppercase">إشعار السيستم المربوط:</p>
                      <p className="text-[11px] font-bold text-white leading-relaxed">{order.adminReply}</p>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/5">
             <Package size={48} className="text-white/20" />
          </div>
          <p className="font-black text-white/40 text-sm">لم يتم تسجيل أي عمليات شحن بعد</p>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
