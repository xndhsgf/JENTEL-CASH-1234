
import React, { useState, useEffect } from 'react';
import { AppConfig, Banner } from '../../types';
import { Plus, Trash2, Image as ImageIcon, X, Save, UploadCloud, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminBannersProps {
  appConfig: AppConfig;
  setAppConfig: (cfg: AppConfig) => Promise<void>;
}

const AdminBanners: React.FC<AdminBannersProps> = ({ appConfig, setAppConfig }) => {
  // مزامنة الحالة المحلية مع Props عند التغيير
  const [banners, setBanners] = useState<Banner[]>(appConfig.banners || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const [newBanner, setNewBanner] = useState({
    title: '',
    url: ''
  });

  // تحديث القائمة المحلية إذا تغيرت الإعدادات من قاعدة البيانات
  useEffect(() => {
    if (appConfig.banners) {
      setBanners(appConfig.banners);
    }
  }, [appConfig.banners]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // تنبيه إذا كانت الصورة أكبر من 800 كيلوبايت
        alert("الصورة كبيرة جداً، يفضل استخدام رابط أو صورة أصغر لضمان الحفظ");
      }
      const reader = new FileReader();
      reader.onloadend = () => setNewBanner({ ...newBanner, url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = () => {
    const trimmedUrl = newBanner.url.trim();
    if (!trimmedUrl) return alert("يرجى اختيار صورة أو وضع رابط للبنر");
    
    const banner: Banner = {
      id: Date.now(),
      title: newBanner.title.trim(),
      url: trimmedUrl
    };
    
    const updatedBanners = [...banners, banner];
    setBanners(updatedBanners);
    setNewBanner({ title: '', url: '' });
    setShowAddModal(false);
  };

  const handleDeleteBanner = (id: number) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    setBanners(updatedBanners);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      // إرسال التحديث إلى الدالة التي تتعامل مع Firestore في App.tsx
      await setAppConfig({ 
        ...appConfig, 
        banners: banners 
      });
      setStatus({ type: 'success', msg: 'تم حفظ جميع التغييرات في قاعدة البيانات' });
      setTimeout(() => setStatus(null), 3000);
    } catch (e: any) {
      console.error("Save Error:", e);
      setStatus({ type: 'error', msg: 'فشل الحفظ: قد يكون حجم الصور كبيراً جداً' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
          <p className="text-xs font-black">{status.msg}</p>
        </div>
      )}

      <button 
        onClick={() => setShowAddModal(true)}
        className="w-full h-14 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
      >
        <Plus size={20}/> إضافة بنر جديد للقائمة
      </button>

      <div className="space-y-4">
        {banners.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group relative">
                <div className="h-40 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={banner.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={banner.title}
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                  />
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                   <div className="text-right">
                      <h4 className="font-black text-slate-800 text-sm truncate max-w-[200px]">{banner.title || 'بدون عنوان'}</h4>
                      <p className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">{banner.url.startsWith('data:') ? 'صورة مرفوعة' : banner.url}</p>
                   </div>
                   <button 
                     onClick={() => handleDeleteBanner(banner.id)}
                     className="p-3 bg-rose-50 text-rose-500 rounded-2xl active:scale-90 transition-all hover:bg-rose-500 hover:text-white"
                   >
                     <Trash2 size={18}/>
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center opacity-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <ImageIcon size={56} className="mx-auto mb-4 text-slate-300"/>
             <p className="text-sm font-black text-slate-400">القائمة فارغة، أضف بنرات ثم اضغط حفظ</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-4 right-4 z-50">
        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className={`w-full h-16 rounded-[2rem] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${isSaving ? 'bg-slate-400' : 'bg-slate-900 text-white'}`}
        >
          {isSaving ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><Save size={24}/> حفظ التغييرات نهائياً</>
          )}
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] p-6 space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
             <div className="flex items-center justify-between border-b border-slate-50 pb-4">
               <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20}/></button>
               <h3 className="text-xl font-black text-slate-900 text-right">إعداد البنر</h3>
             </div>

             <div className="space-y-4">
                <div className="w-full aspect-video rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
                  {newBanner.url ? (
                    <img src={newBanner.url} className="w-full h-full object-cover" alt="Preview" onError={() => alert('رابط الصورة غير صحيح')}/>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon size={32} className="text-rose-400"/>
                      <span className="font-black text-[10px] uppercase">معاينة الصورة ستظهر هنا</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 mr-4 uppercase">استخدام رابط خارجي (URL)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="https://example.com/image.jpg"
                          value={newBanner.url}
                          onChange={e => setNewBanner({...newBanner, url: e.target.value})}
                          className="w-full h-12 bg-slate-50 rounded-2xl pl-12 pr-6 text-right font-bold outline-none border border-slate-100 focus:border-rose-500 text-xs"
                        />
                        <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500" />
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="flex-1 h-[1px] bg-slate-100"></div>
                      <span className="text-[10px] font-black text-slate-300 uppercase">أو</span>
                      <div className="flex-1 h-[1px] bg-slate-100"></div>
                   </div>

                   <label className="w-full h-14 bg-slate-100 text-slate-600 rounded-2xl border-2 border-slate-200 flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all">
                      <UploadCloud size={20} className="text-rose-500"/>
                      <span className="font-black text-xs text-slate-900">رفع ملف من الاستوديو</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>

                   <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-black text-slate-400 mr-4 uppercase">عنوان ترويجي (اختياري)</label>
                      <input 
                        type="text" 
                        placeholder="خصم خاص لمستخدمي التطبيق..."
                        value={newBanner.title}
                        onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                        className="w-full h-12 bg-slate-50 rounded-2xl px-6 text-right font-bold outline-none border border-slate-100 focus:border-rose-500"
                      />
                   </div>
                </div>
             </div>

             <button 
               onClick={handleAddBanner}
               className="w-full h-14 bg-rose-500 text-white rounded-[1.5rem] font-black text-sm active:scale-95 transition-all shadow-lg"
             >
               إضافة للقائمة المؤقتة
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
