
import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { Settings, Save, RefreshCw, Megaphone, DollarSign, Palette, Camera, UploadCloud, Type, Layout } from 'lucide-react';

interface AdminSettingsProps {
  appConfig: AppConfig;
  setAppConfig: (cfg: AppConfig) => Promise<void>;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ appConfig, setAppConfig }) => {
  const [localConfig, setLocalConfig] = useState<AppConfig>(appConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setAppConfig(localConfig);
      alert("تم حفظ كافة الإعدادات بنجاح!");
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'backgroundImageUrl' | 'loginBackgroundImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) return alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 800 كيلوبايت");
      const reader = new FileReader();
      reader.onloadend = () => setLocalConfig({ ...localConfig, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* القسم العام */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-slate-800">إعدادات المنصة الأساسية</h4>
           <Type size={18} className="text-rose-500"/>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
             <label className="text-[10px] font-black text-slate-400 mr-2 uppercase text-right">اسم التطبيق</label>
             <input 
               type="text" 
               value={localConfig.appName}
               onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
               className="h-12 bg-slate-50 rounded-2xl px-6 font-black text-slate-700 outline-none border border-slate-100 focus:border-rose-500 text-right"
               placeholder="مثال: JENTEL-CASH"
             />
          </div>
        </div>
      </div>

      {/* الهوية البصرية (اللوجو) */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 justify-end mb-4">
           <h4 className="font-black text-sm text-slate-800">شعار المنصة (Logo)</h4>
           <Palette size={18} className="text-indigo-500"/>
        </div>
        <div className="flex flex-col items-center gap-4">
           <div className="w-24 h-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
              <img src={localConfig.logoUrl} className="w-16 h-16 object-contain" alt="Logo Preview" />
           </div>
           <label className="w-full h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer active:scale-95 transition-all">
              <UploadCloud size={16}/> رفع شعار جديد
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'logoUrl')} />
           </label>
        </div>
      </div>

      {/* الخلفيات */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-slate-800">تخصيص الخلفيات</h4>
           <Layout size={18} className="text-emerald-500"/>
        </div>

        {/* خلفية شاشة الدخول */}
        <div className="space-y-3">
           <label className="block text-[10px] font-black text-slate-400 mr-2 uppercase text-right text-emerald-600">خلفية شاشة تسجيل الدخول (الخارجية)</label>
           <label className="w-full aspect-video rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
              {localConfig.loginBackgroundImageUrl ? (
                <div className="relative w-full h-full">
                   <img src={localConfig.loginBackgroundImageUrl} className="w-full h-full object-cover" alt="Login BG"/>
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Camera size={24}/></div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300">
                   <UploadCloud size={32}/><span className="text-[10px] font-black uppercase">رفع خلفية خارجية</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'loginBackgroundImageUrl')} />
           </label>
           {localConfig.loginBackgroundImageUrl && (
             <button onClick={() => setLocalConfig({...localConfig, loginBackgroundImageUrl: ''})} className="w-full py-1 text-[9px] font-black text-rose-500">إزالة والعودة للأزرق الافتراضي</button>
           )}
        </div>

        {/* خلفية الموقع الداخلية */}
        <div className="space-y-3">
           <label className="block text-[10px] font-black text-slate-400 mr-2 uppercase text-right text-blue-600">خلفية التطبيق من الداخل</label>
           <label className="w-full aspect-video rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
              {localConfig.backgroundImageUrl ? (
                <div className="relative w-full h-full">
                   <img src={localConfig.backgroundImageUrl} className="w-full h-full object-cover" alt="Internal BG"/>
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Camera size={24}/></div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300">
                   <UploadCloud size={32}/><span className="text-[10px] font-black uppercase">رفع خلفية داخلية</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'backgroundImageUrl')} />
           </label>
        </div>
      </div>

      {/* الأسعار */}
      <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl space-y-4">
        <div className="flex items-center gap-2 justify-end mb-2">
           <h4 className="font-black text-sm text-white">التحكم في أسعار الصرف</h4>
           <DollarSign size={18} className="text-yellow-400"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
           <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-white/40 text-center uppercase">سعر الدولار (EGP)</label>
              <input type="number" value={localConfig.usdToEgpRate} onChange={e => setLocalConfig({...localConfig, usdToEgpRate: parseFloat(e.target.value)})} className="h-12 bg-white/5 rounded-2xl px-4 font-black text-emerald-400 border border-white/10 text-center" />
           </div>
           <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-white/40 text-center uppercase">معدل الكوينز العالمي</label>
              <input type="number" value={localConfig.globalUsdToCoinRate} onChange={e => setLocalConfig({...localConfig, globalUsdToCoinRate: parseInt(e.target.value)})} className="h-12 bg-white/5 rounded-2xl px-4 font-black text-yellow-400 border border-white/10 text-center" />
           </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full h-16 bg-rose-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-rose-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        {isSaving ? <RefreshCw className="animate-spin" size={24}/> : <><Save size={24}/> حفظ كافة التغييرات</>}
      </button>
    </div>
  );
};

export default AdminSettings;
