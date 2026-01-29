
import React, { useState, useEffect } from 'react';
import { Heart, Zap, Clock, AlertTriangle, XCircle, Activity, DollarSign } from 'lucide-react';
import { Product, AppConfig } from '../types';

interface PurchaseModalProps {
  product: Product | null;
  isOpen: boolean;
  appConfig: AppConfig;
  onClose: () => void;
  onConfirm: (product: Product, idValue: string, customPriceUSD?: number, coins?: number) => Promise<boolean> | boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, isOpen, onClose, onConfirm, appConfig }) => {
  const [idValue, setIdValue] = useState('');
  const [customPriceUSD, setCustomPriceUSD] = useState<string>('');
  const [calculatedCoins, setCalculatedCoins] = useState<number>(0);

  useEffect(() => {
    if (product) {
      if (product.isCustomAmount) {
        setCustomPriceUSD(product.priceUSD.toString());
      } else {
        setCalculatedCoins(product.amount);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product?.isCustomAmount && customPriceUSD) {
      const priceInUSD = parseFloat(customPriceUSD);
      if (!isNaN(priceInUSD) && priceInUSD > 0) {
        const coins = priceInUSD * (product.usdToCoinRate || 100);
        setCalculatedCoins(Math.floor(coins));
      } else {
        setCalculatedCoins(0);
      }
    }
  }, [customPriceUSD, product]);

  if (!isOpen || !product) return null;

  const currentPriceUSD = product.isCustomAmount ? (parseFloat(customPriceUSD) || 0) : product.priceUSD;

  const handleBuy = async () => {
    if (!idValue.trim()) {
      alert('يرجى إدخال معرّف اللاعب');
      return;
    }
    if (product.isCustomAmount && currentPriceUSD <= 0) {
       alert('يرجى إدخال مبلغ صحيح');
       return;
    }
    const success = await onConfirm(product, idValue, currentPriceUSD, calculatedCoins);
    if (success) {
      onClose();
      setIdValue('');
      setCustomPriceUSD('');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-[380px] bg-[#f8fafc] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white rtl" dir="rtl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
               <div className="bg-[#facc15] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white">
                  <img src="https://flagcdn.com/w20/us.png" className="w-5 h-3 object-contain rounded-sm" alt="US" />
                  <span className="text-white font-black text-sm">${currentPriceUSD.toFixed(2)}</span>
               </div>
               {product.isAutomatic && (
                 <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-pulse">
                    <Activity size={10} />
                    <span className="text-[8px] font-black uppercase">مربوط بالشحن التلقائي</span>
                 </div>
               )}
            </div>
            <div className="flex items-center gap-3 text-right">
               <span className="text-slate-400 font-black text-[12px] uppercase tracking-wider">{product.name}</span>
               <Heart className="text-slate-300 fill-slate-300" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center shadow-sm border border-slate-100">
                <span className="text-[10px] font-black text-slate-300 mb-1 text-center uppercase">الكوينز</span>
                <span className="text-xl font-black text-slate-800">{calculatedCoins.toLocaleString()}</span>
             </div>
             <div className="bg-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center shadow-sm border border-slate-100">
                <span className="text-[10px] font-black text-slate-300 mb-1 text-center uppercase">السعر الإجمالي</span>
                <div className="flex items-center gap-1">
                   <span className="text-xl font-black text-green-600">${currentPriceUSD.toLocaleString()}</span>
                </div>
             </div>
          </div>

          <div className="space-y-4 mb-8">
             {product.isCustomAmount && (
               <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 px-4 uppercase">أدخل المبلغ المطلوب بالدولار ($)</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      value={customPriceUSD}
                      onChange={(e) => setCustomPriceUSD(e.target.value)}
                      className="w-full h-14 bg-white rounded-full px-6 text-center font-black text-green-600 border-2 border-[#facc15]/40 outline-none shadow-inner text-xl"
                      placeholder="0.00 $"
                    />
                    <DollarSign size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500/30" />
                  </div>
               </div>
             )}
             <div className="space-y-1 text-right">
                <p className="text-[10px] font-black text-slate-400 px-4 uppercase">معرف اللاعب المطلوب (ID)</p>
                <input 
                  type="text" 
                  value={idValue}
                  onChange={(e) => setIdValue(e.target.value)}
                  placeholder="أدخل الـ ID هنا..."
                  className="w-full h-16 bg-[#e2e8f0]/50 rounded-full px-8 text-center font-bold text-slate-600 outline-none border-none placeholder:text-slate-300"
                />
             </div>
          </div>

          <div className="flex gap-4 mb-8">
             <button onClick={handleBuy} className="flex-1 h-14 bg-gradient-to-b from-[#facc15] to-[#eab308] text-white rounded-full font-black text-lg shadow-lg active:scale-95 transition-all">شحن الآن</button>
             <button onClick={onClose} className="flex-1 h-14 bg-white border-2 border-rose-100 text-rose-500 rounded-full font-black text-lg active:scale-95 transition-all">إلغاء</button>
          </div>

          <div className="space-y-3 px-2 border-r-2 border-slate-100 text-right">
             <div className="flex items-center justify-end gap-3">
                <span className="text-[11px] font-black text-slate-500">هذا المنتج يتم شحنه بواسطة الروبوت آلياً</span>
                <Zap size={18} className="text-yellow-400" />
             </div>
             <div className="flex items-center justify-end gap-3">
                <span className="text-[11px] font-black text-slate-500">يتم فحص الرابط ومعالجة الطلب فوراً</span>
                <Clock size={18} className="text-slate-300" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
