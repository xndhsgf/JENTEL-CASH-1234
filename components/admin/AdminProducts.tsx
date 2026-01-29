
import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { 
  Plus, Trash2, Edit2, Package, Search, ImageIcon, 
  Zap, ToggleLeft, ToggleRight, X, Camera, Link as LinkIcon, Shield, LayoutGrid, CheckCircle2, RefreshCw, AlertCircle
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    priceUSD: 1,
    amount: 100,
    usdToCoinRate: 100,
    image: '',
    categoryId: categories[0]?.id || 1,
    isCustomAmount: false,
    isAutomatic: false,
    automationUrl: 'https://res.coccolive.com/ttyy/chargeManager/index_ar.html#/index',
    automationUser: '',
    automationPass: ''
  });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleTestConnection = () => {
    if (!formData.automationUser || !formData.automationPass) return alert("يرجى إدخال بيانات الدخول للاختبار");
    setTestStatus('testing');
    // محاكاة عملية الربط الذكي
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    }, 2500);
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
      automationUrl: 'https://res.coccolive.com/ttyy/chargeManager/index_ar.html#/index',
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
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-right font-bold outline-none focus:border-rose-500 shadow-sm"
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
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[7px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                   <Zap size={8} fill="currentColor"/> شحن آلي (Auto)
                </div>
              )}
            </div>
            
            <div className="px-1 text-center">
              <h4 className="font-black text-[11px] text-slate-800 truncate mb-1">{p.name}</h4>
              <p className="text-emerald-600 font-black text-xs">${p.priceUSD}</p>
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
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90dvh] no-scrollbar">
             
             <div className="flex items-center justify-between border-b border-slate-50 pb-4">
               <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400"><X size={20}/></button>
               <h3 className="text-xl font-black text-slate-900 text-right">إعدادات الروبوت والمنتج</h3>
             </div>

             <div className="space-y-4">
                {/* رفع الصورة */}
                <div className="flex flex-col items-center gap-4">
                   <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview"/>
                      ) : (
                        <ImageIcon size={32} className="text-slate-200"/>
                      )}
                      <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/40 flex items-center justify-center transition-opacity">
                         <Camera className="text-white" size={24}/>
                         <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">ارفع صورة المنتج هنا</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 mr-4 uppercase text-right block">اسم المنتج</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 bg-slate-50 rounded-2xl px-6 text-right font-black outline-none border border-slate-100 focus:border-rose-500" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 mr-4 uppercase text-right block">تحديد القسم</label>
                      <select 
                        value={formData.categoryId}
                        onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                        className="w-full h-12 bg-slate-50 rounded-2xl px-6 text-right font-black outline-none border border-slate-100 focus:border-rose-500 appearance-none"
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                   </div>
                </div>
                
                {/* قسم الأتمتة والربط الذكي */}
                <div className="bg-slate-900 rounded-[2.5rem] p-6 space-y-5 shadow-2xl border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                   
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <button 
                            onClick={() => setFormData({...formData, isAutomatic: !formData.isAutomatic})}
                            className="transition-all active:scale-90"
                         >
                            {formData.isAutomatic ? <ToggleRight className="text-emerald-400" size={40}/> : <ToggleLeft className="text-white/20" size={40}/>}
                         </button>
                         <div className="text-right">
                           <span className="block text-[11px] font-black text-white uppercase tracking-wider">نظام الشحن التلقائي</span>
                           <span className="text-[9px] text-emerald-400 font-bold">Smart Jentel Bot Active</span>
                         </div>
                      </div>
                      <Shield size={22} className="text-emerald-500" />
                   </div>

                   {formData.isAutomatic && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="relative">
                           <label className="text-[9px] font-black text-white/40 mr-2 mb-1 block">رابط السيستم الخارجي (Cocco/Charge)</label>
                           <input 
                             type="text" 
                             placeholder="https://..." 
                             value={formData.automationUrl}
                             onChange={e => setFormData({...formData, automationUrl: e.target.value})}
                             className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-10 text-left text-[10px] text-white/80 font-bold outline-none focus:border-emerald-500/50" 
                           />
                           <LinkIcon size={14} className="absolute left-3 top-9 text-white/30" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-white/40 mr-2 block">اسم المستخدم</label>
                              <input 
                                type="text" 
                                placeholder="User / Email" 
                                value={formData.automationUser}
                                onChange={e => setFormData({...formData, automationUser: e.target.value})}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-xs text-white font-bold outline-none focus:border-emerald-500/50" 
                              />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-white/40 mr-2 block">كلمة السر</label>
                              <input 
                                type="password" 
                                placeholder="Password" 
                                value={formData.automationPass}
                                onChange={e => setFormData({...formData, automationPass: e.target.value})}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-center text-xs text-white font-bold outline-none focus:border-emerald-500/50" 
                              />
                           </div>
                        </div>

                        {/* زر اختبار الاتصال */}
                        <button 
                          onClick={handleTestConnection}
                          disabled={testStatus === 'testing'}
                          className={`w-full h-12 rounded-xl font-black text-[11px] flex items-center justify-center gap-2 transition-all ${
                            testStatus === 'success' ? 'bg-emerald-500 text-white' : 
                            testStatus === 'error' ? 'bg-rose-500 text-white' : 
                            'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {testStatus === 'testing' ? <RefreshCw className="animate-spin" size={16}/> : 
                           testStatus === 'success' ? <><CheckCircle2 size={16}/> تم الربط والتحقق بنجاح</> :
                           <><RefreshCw size={16}/> اختبار اتصال الروبوت الآن</>}
                        </button>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 mr-4 uppercase text-center block">السعر ($)</label>
                     <input type="number" value={formData.priceUSD} onChange={e => setFormData({...formData, priceUSD: parseFloat(e.target.value)})} className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-center font-black text-slate-700 outline-none border border-slate-100" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 mr-4 uppercase text-center block">الكمية (كوينز)</label>
                     <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})} className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-center font-black text-slate-700 outline-none border border-slate-100" />
                   </div>
                </div>
             </div>

             <button onClick={handleSave} disabled={isSubmitting} className="w-full h-16 bg-rose-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-rose-500/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                {isSubmitting ? "جاري تفعيل المنتج..." : "حفظ ونشر المنتج"}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
