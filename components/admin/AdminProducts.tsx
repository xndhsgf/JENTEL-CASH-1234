
import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { 
  Plus, Trash2, Edit2, Package, Search, ImageIcon, 
  Zap, ToggleLeft, ToggleRight, X, Camera, Link as LinkIcon, Shield, LayoutGrid, CheckCircle2, RefreshCw, Globe, Lock, User as UserIcon, Terminal, Activity, Eye, Cpu
} from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  setProducts: (id: string | null, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ products, categories, setProducts, deleteProduct }) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'discovering' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    priceUSD: 1,
    amount: 100,
    usdToCoinRate: 100,
    image: '',
    categoryId: categories[0]?.id || 1,
    isCustomAmount: false,
    isAutomatic: false,
    automationUrl: '',
    automationUser: '',
    automationPass: ''
  });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleToggleAuto = () => {
    setFormData(prev => ({ ...prev, isAutomatic: !prev.isAutomatic }));
  };

  const handleToggleCustom = () => {
    setFormData(prev => ({ ...prev, isCustomAmount: !prev.isCustomAmount }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id.toString());
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleConnectAndDiscover = () => {
    if (!formData.automationUrl) return alert("يرجى إدخال الرابط أولاً");
    if (!formData.automationUser || !formData.automationPass) return alert("يرجى إدخال بيانات الدخول للروبوت");
    
    setTestStatus('discovering');
    // محاكاة اكتشاف الصفحة وتحليل الحقول
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => {
        setShowPortal(false);
        setTestStatus('idle');
      }, 1500);
    }, 2500);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("يرجى إدخال اسم المنتج");
    if (!formData.image) return alert("يرجى رفع صورة للمنتج");
    
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        priceEGP: (formData.priceUSD || 0) * 50,
        amount: formData.isCustomAmount 
          ? (formData.priceUSD || 0) * (formData.usdToCoinRate || 100) 
          : formData.amount
      };
      
      await setProducts(editingId, dataToSave);
      setShowModal(false);
      resetForm();
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      priceUSD: 1,
      amount: 100,
      usdToCoinRate: 100,
      image: '',
      categoryId: categories[0]?.id || 1,
      isCustomAmount: false,
      isAutomatic: false,
      automationUrl: '',
      automationUser: '',
      automationPass: ''
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 rtl" dir="rtl">
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="w-full h-14 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
        >
          <Plus size={20}/> إضافة منتج جديد
        </button>

        <div className="relative">
          <input 
            type="text" 
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-right font-bold outline-none focus:border-rose-500 shadow-sm text-slate-900"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-50 mb-3 border border-slate-100 relative">
              <img src={p.image} className="w-full h-full object-cover" alt={p.name}/>
              {p.isAutomatic && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[7px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                   <Activity size={8} /> رابط متصل مباشر
                </div>
              )}
            </div>
            
            <div className="px-1 text-center">
              <h4 className="font-black text-[11px] text-slate-900 truncate mb-1">{p.name}</h4>
              <p className="text-emerald-600 font-black text-xs">${p.priceUSD}</p>
              {p.isCustomAmount && <span className="text-[8px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-black">قيمة حرة</span>}
            </div>
            
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(p)} className="w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-xl flex items-center justify-center text-blue-500 active:scale-90"><Edit2 size={14}/></button>
              <button onClick={() => deleteProduct(p.id.toString())} className="w-8 h-8 bg-white/90 backdrop-blur shadow-md rounded-xl flex items-center justify-center text-red-500 active:scale-90"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => !isSubmitting && setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90dvh] no-scrollbar text-right">
             
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
               <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20}/></button>
               <h3 className="text-xl font-black text-slate-900">إدارة المنتج والروبوت العالمي</h3>
             </div>

             <div className="space-y-4">
                {/* مفاتيح التحكم الذكي */}
                <div className="grid grid-cols-2 gap-3">
                   <div onClick={handleToggleAuto} className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${formData.isAutomatic ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                      {formData.isAutomatic ? <ToggleRight className="text-emerald-500" size={32}/> : <ToggleLeft className="text-slate-300" size={32}/>}
                      <span className={`text-[10px] font-black uppercase ${formData.isAutomatic ? 'text-emerald-700' : 'text-slate-400'}`}>تفعيل الربط المباشر</span>
                   </div>
                   <div onClick={handleToggleCustom} className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${formData.isCustomAmount ? 'border-amber-500 bg-amber-50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                      {formData.isCustomAmount ? <ToggleRight className="text-amber-500" size={32}/> : <ToggleLeft className="text-slate-300" size={32}/>}
                      <span className={`text-[10px] font-black uppercase ${formData.isCustomAmount ? 'text-amber-700' : 'text-slate-400'}`}>تحديد مبلغ حر (USD)</span>
                   </div>
                </div>

                {/* نظام الربط المباشر العالمي */}
                {formData.isAutomatic && (
                   <div className="bg-slate-950 rounded-[2.5rem] p-6 space-y-4 shadow-2xl border border-white/5 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex flex-col">
                            <span className="text-emerald-400 text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
                               <Cpu size={14} className="animate-spin-slow"/> محرك الربط العالمي JENTEL-BOT
                            </span>
                            <span className="text-white/30 text-[8px] font-bold">Universal Automated Connector v3.0</span>
                         </div>
                         <Shield className="text-emerald-500/20" size={24}/>
                      </div>

                      <div className="space-y-3">
                        <div className="relative">
                           <label className="text-[9px] font-black text-white/40 mr-2 mb-1 block">رابط السيستم المراد ربطه (أي رابط)</label>
                           <input 
                             type="text" 
                             placeholder="ضع الرابط هنا (https://...)" 
                             value={formData.automationUrl}
                             onChange={e => setFormData({...formData, automationUrl: e.target.value})}
                             className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-10 text-left text-[10px] text-white font-bold outline-none focus:border-emerald-500/50" 
                           />
                           <LinkIcon size={14} className="absolute left-3 top-9 text-white/30" />
                        </div>
                        
                        <button 
                          onClick={() => setShowPortal(true)}
                          className="w-full h-12 bg-emerald-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                           <Globe size={16}/> {formData.automationUser ? 'تعديل بيانات الدخول والربط' : 'بدء اكتشاف الصفحة والربط'}
                        </button>
                        
                        {formData.automationUser && (
                          <div className="flex items-center justify-center gap-2 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                             <CheckCircle2 size={12} className="text-emerald-400"/>
                             <span className="text-[9px] font-bold text-white/80">تم حفظ بيانات السيستم المربوط</span>
                          </div>
                        )}
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 mr-2 uppercase block">السعر الأساسي ($)</label>
                     <input type="number" value={formData.priceUSD} onChange={e => setFormData({...formData, priceUSD: parseFloat(e.target.value)})} className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-center font-black text-slate-900 outline-none border border-slate-100" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 mr-2 uppercase block">كوينز مقابل 1$</label>
                     <input type="number" value={formData.usdToCoinRate} onChange={e => setFormData({...formData, usdToCoinRate: parseInt(e.target.value)})} className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-center font-black text-slate-900 outline-none border border-slate-100" />
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 mr-2 uppercase block">اسم المنتج</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 bg-slate-50 rounded-2xl px-6 font-black text-slate-900 outline-none border border-slate-100 focus:border-rose-500" />
                </div>

                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                   <div className="w-20 h-20 bg-white rounded-2xl border-2 border-slate-200 overflow-hidden mb-2">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-6 text-slate-200" />}
                   </div>
                   <label className="text-rose-500 text-[10px] font-black cursor-pointer uppercase">تغيير الصورة <input type="file" className="hidden" onChange={handleImageUpload}/></label>
                </div>
             </div>

             <button onClick={handleSave} disabled={isSubmitting} className="w-full h-16 bg-rose-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-rose-500/30 active:scale-95 transition-all">
                {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج وتفعيل الربط"}
             </button>
          </div>
        </div>
      )}

      {/* بوابة الاكتشاف والربط المباشر */}
      {showPortal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setShowPortal(false)} />
           <div className="relative w-full max-w-sm bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              
              <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-white/10">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg" />
                 </div>
                 <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <Globe size={10} className="text-white/40" />
                    <span className="text-[9px] font-mono text-white/60 truncate max-w-[150px]">{formData.automationUrl || 'Direct Link Binding...'}</span>
                 </div>
              </div>

              <div className="p-8 space-y-6">
                 <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                       {testStatus === 'discovering' ? <RefreshCw className="animate-spin text-emerald-500" size={32}/> : <Terminal size={32} className="text-emerald-500" />}
                    </div>
                    <h4 className="text-lg font-black text-slate-800 tracking-tight">بوابة الربط بالرابط المباشر</h4>
                    <p className="text-[10px] font-bold text-slate-400 px-6 leading-relaxed">
                       {testStatus === 'discovering' ? 'جاري فحص الصفحة واكتشاف حقول الشحن (ID / Amount)...' : 'أدخل بيانات الدخول للرابط. سيقوم الروبوت بحفظها لاكتشاف الحقول فور الدخول.'}
                    </p>
                 </div>

                 {testStatus !== 'discovering' && (
                   <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="relative">
                         <input 
                           type="text" 
                           placeholder="اسم المستخدم في الرابط" 
                           value={formData.automationUser}
                           onChange={e => setFormData({...formData, automationUser: e.target.value})}
                           className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 text-center font-black text-slate-900 outline-none focus:border-emerald-500"
                         />
                         <UserIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                      <div className="relative">
                         <input 
                           type="password" 
                           placeholder="كلمة المرور في الرابط" 
                           value={formData.automationPass}
                           onChange={e => setFormData({...formData, automationPass: e.target.value})}
                           className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 text-center font-black text-slate-900 outline-none focus:border-emerald-500"
                         />
                         <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      </div>
                   </div>
                 )}

                 <button 
                   onClick={handleConnectAndDiscover}
                   disabled={testStatus === 'discovering'}
                   className={`w-full h-16 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-3 transition-all ${
                     testStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white active:scale-95'
                   }`}
                 >
                    {testStatus === 'discovering' ? <RefreshCw className="animate-spin" size={20}/> : 
                     testStatus === 'success' ? <><CheckCircle2 size={20}/> تم الربط والتحليل</> : 
                     <><Zap size={20}/> ربط السيستم واكتشاف الحقول</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
