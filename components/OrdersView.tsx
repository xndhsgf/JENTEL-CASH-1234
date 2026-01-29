
import React from 'react';
import { Search, Package, CheckCircle, Clock, XCircle, MessageSquare, Zap, Terminal, Activity } from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  return (
    <div className="p-4 pb-32 animate-in fade-in duration-500 min-h-screen rtl bg-transparent" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-black text-white/60">الإجمالي: {orders.length}</span>
         </div>
         <h2 className="text-xl font-black text-white text-right">سجل طلباتي</h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl space-y-5 relative overflow-hidden group">
              {/* شارة الأتمتة */}
              {order.status === 'processing' && (
                <div className="absolute top-0 left-0 bg-emerald-500 text-white px-6 py-1 rounded-br-[2rem] flex items-center gap-2 animate-pulse">
                   <Zap size={12} fill="currentColor"/>
                   <span className="text-[8px] font-black uppercase tracking-widest">Auto Bot Active</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center overflow-hidden border-2 border-white/10 bg-slate-800 shadow-xl`}>
                    <img src={order.productImage} className="w-full h-full object-cover" alt=""/>
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-sm text-white leading-tight">{order.productName}</h4>
                    <p className="text-[9px] text-white/30 font-bold mt-1 uppercase tracking-tighter">#{order.id.slice(0, 8)} | {order.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-white font-black text-base mb-1">${order.priceUSD.toFixed(2)}</div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : order.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {order.status === 'completed' ? <CheckCircle size={12} /> : order.status === 'rejected' ? <XCircle size={12} /> : <Activity size={12} className="animate-spin" />}
                    <span>{order.status === 'completed' ? 'مكتمل' : order.status === 'rejected' ? 'مرفوض' : 'جاري التنفيذ..'}</span>
                  </div>
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-black/30 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[8px] font-black text-white/30 mb-1 uppercase">آي دي اللاعب</p>
                    <p className="text-xs font-black text-amber-400 tracking-wider">{order.playerId}</p>
                 </div>
                 <div className="bg-black/30 rounded-2xl p-4 border border-white/5 text-center">
                    <p className="text-[8px] font-black text-white/30 mb-1 uppercase">الكمية المشحونة</p>
                    <p className="text-xs font-black text-emerald-400">{order.coinsAmount.toLocaleString()} كوينز</p>
                 </div>
              </div>

              {/* مراقب البوت الذكي (يظهر فقط في حالة التنفيذ الآلي) */}
              {order.automationLogs && order.automationLogs.length > 0 && (
                <div className="bg-slate-900 rounded-[1.8rem] p-5 border border-white/5 space-y-3 shadow-inner">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1.5">
                         <Terminal size={12}/> JENTEL-BOT 1.0 LOGS
                      </span>
                      <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                   </div>
                   <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                      {order.automationLogs.map((log, i) => (
                        <div key={i} className="flex items-center gap-3 text-right">
                           <span className="text-[7px] font-mono text-white/20">[{new Date().toLocaleTimeString('ar-EG', {hour12:false})}]</span>
                           <p className={`text-[9px] font-bold ${i === order.automationLogs!.length - 1 ? 'text-emerald-400' : 'text-white/50'}`}>
                             {log}
                           </p>
                        </div>
                      ))}
                      {order.status === 'processing' && (
                        <div className="flex items-center gap-2 mt-2">
                           <div className="flex gap-1">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                           </div>
                           <span className="text-[8px] font-black text-emerald-400/50 uppercase">Waiting for next response...</span>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* رسالة الإدارة */}
              {order.adminReply && (
                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 flex gap-4 items-start">
                   <MessageSquare size={18} className="text-blue-400 mt-1 shrink-0" />
                   <div className="text-right flex-1">
                      <p className="text-[9px] font-black text-blue-400 mb-1 uppercase">إشعار من النظام:</p>
                      <p className="text-[11px] font-bold text-white/80 leading-relaxed">{order.adminReply}</p>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
             <Package size={48} className="text-white/10" />
          </div>
          <p className="font-black text-white/40 text-sm">لم تقم بإجراء أي طلبات حتى الآن</p>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
