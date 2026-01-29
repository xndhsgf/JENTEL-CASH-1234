
import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Trash2, LayoutGrid, Image as ImageIcon, Search, X } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  addCategory: (data: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, addCategory, deleteCategory }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = categories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.image.trim()) {
      alert("يرجى إكمال جميع الحقول");
      return;
    }
    setIsSubmitting(true);
    try {
      // Create a numeric ID or use Firestore auto-ID
      const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
      await addCategory({ ...formData, id: newId });
      setShowModal(false);
      setFormData({ title: '', image: '' });
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء إضافة القسم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${title}"؟`)) {
      try {
        await deleteCategory(id);
      } catch (e) {
        console.error(e);
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header Actions */}
      <div className="flex gap-3">
        <button 
          onClick={() => setShowModal(true)}
          className="flex-1 h-14 bg-rose-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
        >
          <Plus size={20}/> إضافة قسم جديد
        </button>
        <div className="relative w-14 h-14">
           <div className="absolute inset-0 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
             <LayoutGrid size={22}/>
           </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="ابحث عن قسم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-right font-bold outline-none focus:border-rose-500 shadow-sm"
        />
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
              <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.title} />
            </div>
            <div className="px-2">
              <h4 className="font-black text-sm text-slate-800 text-center truncate">{cat.title}</h4>
              <p className="text-[9px] text-slate-400 font-bold text-center mt-1 uppercase">ID: {cat.id}</p>
            </div>
            
            <button 
              onClick={() => handleDelete(cat.id.toString(), cat.title)}
              className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur shadow-lg rounded-xl flex items-center justify-center text-red-500 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16}/>
            </button>
          </div>
        )) : (
          <div className="col-span-2 py-20 text-center opacity-40">
             <LayoutGrid size={48} className="mx-auto mb-4 text-slate-300" />
             <p className="text-sm font-bold text-slate-400">لا توجد أقسام مطابقة</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => !isSubmitting && setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] p-8 space-y-5 animate-in zoom-in-95 duration-300 shadow-2xl">
             <div className="flex items-center justify-between mb-2">
               <button onClick={() => setShowModal(false)} className="text-slate-400"><X size={24}/></button>
               <h3 className="text-xl font-black text-slate-900 text-right">إضافة قسم جديد</h3>
             </div>
             
             <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 mr-4 uppercase">اسم القسم</label>
                 <input 
                   type="text" 
                   placeholder="مثال: قسم الألعاب" 
                   value={formData.title} 
                   onChange={e => setFormData({...formData, title: e.target.value})} 
                   className="w-full h-14 bg-slate-50 rounded-2xl px-6 text-right font-bold outline-none border border-slate-100 focus:border-rose-500" 
                 />
               </div>
               
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 mr-4 uppercase">رابط صورة القسم</label>
                 <div className="relative">
                   <input 
                     type="text" 
                     placeholder="https://..." 
                     value={formData.image} 
                     onChange={e => setFormData({...formData, image: e.target.value})} 
                     className="w-full h-14 bg-slate-50 rounded-2xl px-14 text-left font-bold outline-none border border-slate-100 focus:border-rose-500" 
                   />
                   <ImageIcon size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
               </div>

               {formData.image && (
                 <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image')} />
                 </div>
               )}
             </div>

             <button 
               onClick={handleAdd} 
               disabled={isSubmitting}
               className="w-full h-16 bg-rose-500 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
               {isSubmitting ? "جاري الإضافة..." : "تأكيد الإضافة"}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
