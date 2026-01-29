
import React from 'react';
import { Search } from 'lucide-react';
import { RechargeMethod } from '../types';

export const RECHARGE_METHODS: RechargeMethod[] = [
  { id: 1, label: 'تواصل دولار $', icon: 'https://cdn-icons-png.flaticon.com/512/9402/9402325.png', color: 'from-blue-900 to-blue-700', iban: 'TR1234567890', recipientName: 'Tawasul Dollars Co.', instructions: 'يرجى كتابة اسم المرسل بدقة لسرعة التنفيذ.', currencyIcon: '🇺🇸' },
  { id: 2, label: 'حوالات مالية', icon: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png', color: 'from-indigo-900 to-indigo-700', iban: 'HWT-99887766', recipientName: 'Financial Transfers Ltd', instructions: 'التحويل يستغرق من 15 إلى 60 دقيقة.', currencyIcon: '💰' },
  { id: 3, label: 'حسابات بنك تركيا', icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png', color: 'from-blue-800 to-blue-600', iban: 'TR750006400000161250817779', recipientName: 'Bros App Teknoloji Limited Şirketi', instructions: 'يرجى كتابة اسم المرسل لسرعة التشييك. مدة التشييك تستغرق من دقيقة حتى 30 دقيقة. أوقات التشييك من الساعة 10 صباحا حتى 1 ليلاً. أقل إيداع 1000 ليرة 🇹🇷. شاكرين تعاونكم معنا 🌹🌹', currencyIcon: '🇹🇷' },
  { id: 4, label: 'حسابات USDT اتوماتيك', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', color: 'from-green-900 to-green-700', iban: '0x123...abc', recipientName: 'USDT Auto Gateway', instructions: 'يرجى إرسال المبلغ على شبكة TRC20 حصراً.', currencyIcon: '💵' },
  { id: 5, label: 'حسابات BEP20', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', color: 'from-slate-900 to-slate-800', iban: '0x456...def', recipientName: 'BEP20 Main Node', instructions: 'أقل مبلغ للإرسال هو 10 دولار.', currencyIcon: '💎' },
  { id: 6, label: 'شركة تواصل تركي', icon: 'https://cdn-icons-png.flaticon.com/512/9402/9402325.png', color: 'from-orange-600 to-orange-500', iban: 'TR-TURK-990', recipientName: 'Tawasul Turk Co.', instructions: 'التحويل يتم خلال دقائق.', currencyIcon: '🇹🇷' },
  { id: 7, label: 'فودافون كاش', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/1024px-Vodafone_icon.svg.png', color: 'from-red-700 to-red-600', iban: '010XXXXXXXX', recipientName: 'Vodafone Cash Agent', instructions: 'يرجى إرسال صورة التحويل لسرعة التأكيد.', currencyIcon: '🇪🇬' },
  { id: 8, label: 'Whish money', icon: 'https://play-lh.googleusercontent.com/O6yFvQO6iVn3zI0F8W-E8E8z8W-E8E8z8W-E8E8z8W-E8E8z8W-E8E8z8W-E8E8z8', color: 'from-pink-600 to-pink-500', iban: 'W-9988', recipientName: 'Whish Money Agent', instructions: 'أدخل رقم العملية في حقل الإشعار.', currencyIcon: '🇱🇧' },
  { id: 9, label: 'حسابات TRC20 اتوماتيك', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', color: 'from-teal-800 to-teal-700', iban: 'T...XXXXX', recipientName: 'TRC20 Auto Gateway', instructions: 'تأكد من اختيار شبكة TRON.', currencyIcon: '💵' },
];

interface RechargeViewProps {
  rechargeMethods: RechargeMethod[];
  onSelectMethod: (method: RechargeMethod) => void;
}

const RechargeView: React.FC<RechargeViewProps> = ({ rechargeMethods, onSelectMethod }) => {
  return (
    <div className="p-4 pb-32 animate-in fade-in duration-500 bg-white min-h-screen">
      <div className="grid grid-cols-3 gap-3">
        {rechargeMethods.map((method) => (
          <div 
            key={method.id} 
            onClick={() => onSelectMethod(method)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm group cursor-pointer active:scale-95 transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${method.color}`}>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-right">
               <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-md mb-2">
                  <img src={method.icon} className="w-full h-full object-contain" alt={method.label} />
               </div>
               <span className="text-white text-[9px] font-black leading-tight drop-shadow-sm text-center">
                  {method.label}
               </span>
            </div>
            
            <div className="absolute top-1 left-1 opacity-20">
               <img src="https://cdn-icons-png.flaticon.com/512/9402/9402325.png" className="w-4 h-4 grayscale invert" alt="Jentel" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-24 right-4 z-40">
         <button className="bg-[#facc15] w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <Search size={24} className="text-white" />
         </button>
      </div>
    </div>
  );
};

export default RechargeView;
