
import React, { useState } from 'react';
import { RechargeMethod } from '../../types';
import { Plus, Trash2, Edit2, CreditCard, Image as ImageIcon, Info, User, Hash, Palette, X } from 'lucide-react';

interface AdminRechargeProps {
  rechargeMethods: RechargeMethod[];
  addRechargeMethod: (data: any) => Promise<void>;
  deleteRechargeMethod: (id: string) => Promise<void>;
}

const AdminRecharge: React.FC<AdminRechargeProps> = ({ rechargeMethods, addRechargeMethod, deleteRechargeMethod }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<RechargeMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<RechargeMethod>>({
    label: '',
    icon: '',
    color: 'from-blue-600 to-blue-800',
    iban: '',
    recipientName: '',
    recipientName2: '',
    instructions: '',
    currencyIcon: '💰'
  });

  const handleSave = async () => {
    if (!formData.label || !formData.icon || !formData.iban) {
      alert("يرجى إكمال الحقول الأساسية (الاسم، الأيقونة، رقم الحساب)");
      return;
    }

    setIsSubmitting(true);
    try {
      // Logic for add/update would go here, current App.tsx only has addRechargeMethod
      // We'll use the provided addRechargeMethod for new ones.
      const newId = rechargeMethods.length > 0 ? Math.max(...rechargeMethods.map(m => m.id)) + 1 : 1;
      await addRechargeMethod({ ...formData, id: newId });
      setShowModal(false);
      resetForm();
    } catch (e) {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      icon: '',
      color: 'from-blue-600 to-blue-800',
      iban: '',
      recipientName: '',
      recipientName2: '',
      instructions: '',
      currencyIcon: '💰'
    });
  };

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(`هل أنت متأكد من حذف طريقة "${label}"؟`)) {
      try {
        await deleteRechargeMethod(id);
      } catch (e) {
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const gradients = [
    { name: 'أزرق ملكي', value: 'from-blue-900 to-blue-700' },
    { name: 'بنفسجي', value: 'from-indigo-900 to-indigo-700' },
    { name: 'أخضر غامق', value: 'from-green-900 to-green-700' },
    { name: 'أحمر فودافون', value: 'from-red-700 to-red-600' },
    { name: 'برتقالي', value: 'from-orange-600 to-orange-500' },
    { name: 'وردي', value: 'from-pink-600 to-pink-500' },
    { name: 'أسود فخم', value: 'from-slate-900 to-slate-800' },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <button 
        onClick={() => { resetForm(); setShowModal(true); }}
        className="w-full h-14 bg-rose-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
      >
        <Plus size={20}/> إضافة طريقة شحن جديدة
      </button>

      <div className="grid grid-cols-1 gap-4">
        {rechargeMethods.map((method) => (
          <div key={method.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4 text-right flex-row-reverse">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center p-2.5 shadow-lg`}>
                <img src={method.icon} className="w-full h-full object-contain brightness-0 invert" alt={method.label} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">{method.label}</h4>
                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{method.iban}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleDelete(method.id.toString(), method.label)}
                className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 size={18}/>
              </button>
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
               <h3 className="text-xl font-black text-slate-900 text-right">إعداد طريقة الشحن</h3>
             </div>

             <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">اسم الطريقة</label>
                    <input 
                      type="text" 
                      placeholder="فودافون كاش"
                      value={formData.label} 
                      onChange={e => setFormData({...formData, label: e.target.value})} 
                      className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-right font-bold text-xs outline-none border border-slate-100 focus:border-rose-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">أيقونة العملة</label>
                    <input 
                      type="text" 
                      placeholder="🇪🇬 أو 💰"
                      value={formData.currencyIcon} 
                      onChange={e => setFormData({...formData, currencyIcon: e.target.value})} 
                      className="w-full h-12 bg-slate-50 rounded-2xl px-4 text-center font-bold outline-none border border-slate-100 focus:border-rose-500" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 mr-2 uppercase text-right block">رابط الأيقونة الرسمي</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={formData.icon} 
                      onChange={e => setFormData({...formData, icon: e.target.value})} 
                      className="w-full h-12 bg-slate-50 rounded-2xl px-12 text-left font-bold text-[10px] outline-none border border-slate-100 focus:border-rose-500" 
                    />
                    <ImageIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 mr-2 uppercase text-right block">اختر لون البطاقة</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {gradients.map((g, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setFormData({...formData, color: g.value})}
                        className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${g.value} border-2 ${formData.color === g.value ? 'border-rose-500 scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-slate-50 rounded-[2.5rem] p-5 space-y-4 border border-slate-100">
                   <div className="space-y-1">
                      <label className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 mr-2 uppercase">
                         رقم الحساب / IBAN <Hash size={12}/>
                      </label>
                      <input 
                        type="text" 
                        value={formData.iban} 
                        onChange={e => setFormData({...formData, iban: e.target.value})} 
                        className="w-full h-12 bg-white rounded-2xl px-6 text-center font-black text-slate-700 outline-none border border-slate-200 focus:border-rose-500" 
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 mr-2 uppercase">
                           اسم المستلم 1 <User size={12}/>
                        </label>
                        <input 
                          type="text" 
                          value={formData.recipientName} 
                          onChange={e => setFormData({...formData, recipientName: e.target.value})} 
                          className="w-full h-12 bg-white rounded-2xl px-4 text-right font-bold text-xs outline-none border border-slate-200 focus:border-rose-500" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 mr-2 uppercase">
                           اسم المستلم 2 (اختياري) <User size={12}/>
                        </label>
                        <input 
                          type="text" 
                          value={formData.recipientName2} 
                          onChange={e => setFormData({...formData, recipientName2: e.target.value})} 
                          className="w-full h-12 bg-white rounded-2xl px-4 text-right font-bold text-xs outline-none border border-slate-200 focus:border-rose-500" 
                        />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 mr-2 uppercase">
                         تعليمات الشحن <Info size={12}/>
                      </label>
                      <textarea 
                        value={formData.instructions} 
                        onChange={e => setFormData({...formData, instructions: e.target.value})} 
                        className="w-full h-24 bg-white rounded-2xl p-4 text-right font-bold text-[10px] outline-none border border-slate-200 focus:border-rose-500 resize-none" 
                        placeholder="أضف التعليمات التي ستظهر للمستخدم هنا..."
                      />
                   </div>
                </div>
             </div>

             <button 
               onClick={handleSave} 
               disabled={isSubmitting}
               className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               {isSubmitting ? "جاري الحفظ..." : "تأكيد إضافة الطريقة"}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecharge;
