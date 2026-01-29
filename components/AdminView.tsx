
import React, { useState } from 'react';
import { Product, Category, AppConfig, Order, UserState, RechargeMethod } from '../types';
import { ArrowRight, Menu, ShieldCheck, Wallet, Package, LayoutGrid, CreditCard, Users, Settings as SettingsIcon, Image as ImageIcon, Gift } from 'lucide-react';
import AdminSidebar from './admin/AdminSidebar';
import AdminStats from './admin/AdminStats';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminProducts from './admin/AdminProducts';
import AdminSettings from './admin/AdminSettings';
import AdminCategories from './admin/AdminCategories';
import AdminRecharge from './admin/AdminRecharge';
import AdminBanners from './admin/AdminBanners';
import AdminBonus from './admin/AdminBonus'; 

interface AdminViewProps {
  products: Product[];
  setProducts: (id: string | null, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  categories: Category[];
  addCategory: (data: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  rechargeMethods: RechargeMethod[];
  addRechargeMethod: (data: any) => Promise<void>;
  deleteRechargeMethod: (id: string) => Promise<void>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  allUsers: UserState[];
  updateAnyUser: (email: string, data: any) => Promise<void>;
  deleteAnyUser: (email: string) => Promise<void>;
  currentUser: UserState;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserState>>;
  appConfig: AppConfig;
  setAppConfig: (cfg: AppConfig) => Promise<void>;
  onBack: () => void;
  onUpdateOrder: (orderId: string, status: 'completed' | 'rejected', reply: string) => void;
  onLogout: () => void;
  onGiveBonus: (email: string, productId: number, coins: number) => Promise<void>;
}

const AdminView: React.FC<AdminViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'deposits' | 'bonus' | 'users' | 'products' | 'categories' | 'recharge' | 'banners' | 'settings'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 rtl w-full font-['Cairo']" dir="rtl">
      {/* Admin Header */}
      <div className="sticky top-0 z-[120] bg-slate-900 h-16 flex items-center justify-between px-4 shadow-xl">
        <button onClick={props.onBack} className="p-2.5 bg-white/10 rounded-2xl text-white active:scale-90 transition-transform">
          <ArrowRight size={22} />
        </button>
        <div className="flex items-center gap-2">
           <ShieldCheck size={20} className="text-rose-500" />
           <h2 className="text-sm font-black text-white uppercase tracking-tight">لوحة التحكم الإحترافية</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-rose-500 rounded-2xl text-white active:scale-90 transition-transform shadow-lg shadow-rose-500/30">
          <Menu size={22} />
        </button>
      </div>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={props.onLogout}
      />

      <main className="p-4 flex-1 overflow-x-hidden max-w-md mx-auto w-full">
        <div className="mb-6">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">JENTEL-CASH ADMIN</p>
           <h3 className="text-2xl font-black text-slate-800">
             {activeTab === 'stats' && 'إحصائيات النظام'}
             {activeTab === 'orders' && 'طلبات المنتجات'}
             {activeTab === 'deposits' && 'طلبات الإيداع'}
             {activeTab === 'bonus' && 'رفع بونص للعملاء'}
             {activeTab === 'users' && 'إدارة الأعضاء'}
             {activeTab === 'products' && 'التحكم بالمنتجات'}
             {activeTab === 'categories' && 'الأقسام'}
             {activeTab === 'recharge' && 'طرق الشحن'}
             {activeTab === 'banners' && 'البنرات الإعلانية'}
             {activeTab === 'settings' && 'إعدادات المنصة'}
           </h3>
        </div>

        {activeTab === 'stats' && <AdminStats orders={props.orders} allUsers={props.allUsers} />}
        
        {activeTab === 'orders' && (
          <AdminOrders 
            orders={props.orders} 
            allUsers={props.allUsers} 
            onUpdateOrder={props.onUpdateOrder} 
            typeFilter="product" 
          />
        )}

        {activeTab === 'deposits' && (
          <AdminOrders 
            orders={props.orders} 
            allUsers={props.allUsers} 
            onUpdateOrder={props.onUpdateOrder} 
            typeFilter="recharge" 
          />
        )}

        {activeTab === 'bonus' && (
          <AdminBonus 
            allUsers={props.allUsers} 
            products={props.products} 
            orders={props.orders}
            onGiveBonus={props.onGiveBonus}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsers 
            allUsers={props.allUsers} 
            updateAnyUser={props.updateAnyUser} 
            deleteAnyUser={props.deleteAnyUser} 
          />
        )}

        {activeTab === 'products' && (
          <AdminProducts 
            products={props.products} 
            categories={props.categories} 
            setProducts={props.setProducts} 
            deleteProduct={props.deleteProduct} 
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategories 
            categories={props.categories} 
            addCategory={props.addCategory} 
            deleteCategory={props.deleteCategory} 
          />
        )}

        {activeTab === 'recharge' && (
          <AdminRecharge 
            rechargeMethods={props.rechargeMethods} 
            addRechargeMethod={props.addRechargeMethod} 
            deleteRechargeMethod={props.deleteRechargeMethod} 
          />
        )}

        {activeTab === 'banners' && (
          <AdminBanners 
            appConfig={props.appConfig} 
            setAppConfig={props.setAppConfig} 
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings 
            appConfig={props.appConfig} 
            setAppConfig={props.setAppConfig} 
          />
        )}
      </main>

      <div className="fixed bottom-6 left-6 z-[130] flex flex-col gap-3">
         <button onClick={() => setActiveTab('stats')} className="w-12 h-12 bg-white text-slate-400 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <ShieldCheck size={20} />
         </button>
         <button onClick={() => setIsSidebarOpen(true)} className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-90 transition-all">
            <Menu size={24} />
         </button>
      </div>
    </div>
  );
};

export default AdminView;
