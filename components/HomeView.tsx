
import React, { useState, useEffect, useRef } from 'react';
import { Megaphone, PlusCircle, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import PurchaseModal from './PurchaseModal';
import { Product, UserState, Banner, Category, AppConfig } from '../types';

interface HomeViewProps {
  user: UserState;
  appConfig: AppConfig;
  onPurchase: (product: Product, idValue: string, customPriceUSD?: number, coins?: number) => Promise<boolean> | boolean;
  products: Product[];
  banners: Banner[];
  categories: Category[];
}

const HomeView: React.FC<HomeViewProps> = ({ user, appConfig, onPurchase, products, banners, categories }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(categories[0]?.id || null);
  
  // Touch Handling State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Auto-play interval: 2 seconds as requested
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 2000); // 2000ms = 2 seconds
    return () => clearInterval(timer);
  }, [banners.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const filteredProducts = activeCategoryId 
    ? products.filter(p => p.categoryId === activeCategoryId)
    : products;

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <div className={`pb-32 animate-in fade-in duration-500 min-h-screen ${appConfig.backgroundImageUrl ? 'bg-transparent' : ''}`} style={!appConfig.backgroundImageUrl ? { backgroundColor: 'var(--color-background)' } : {}}>
      {/* الإعلان الترحيبي */}
      <div className="bg-[#fbbf24] px-4 py-3 flex items-center justify-between text-white font-bold text-[11px] shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden flex-row-reverse w-full">
          <Megaphone size={14} className="shrink-0" />
          <p className="truncate text-right flex-1">{appConfig.welcomeAnnouncement}</p>
        </div>
        <button className="bg-[#1e293b] text-white px-3 py-1 rounded-md text-[10px] font-black shrink-0 mr-3">الحماية</button>
      </div>

      {/* البنرات المطورة مع دعم اللمس */}
      <div className="px-4 mt-4 relative group">
        <div 
          className="relative h-48 w-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {banners.length > 0 ? banners.map((banner, index) => (
            <div 
              key={banner.id} 
              className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                index === currentBanner 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : index < currentBanner 
                    ? 'opacity-0 -translate-x-full scale-95' 
                    : 'opacity-0 translate-x-full scale-95'
              }`}
            >
              <img src={banner.url} alt={banner.title} className="w-full h-full object-cover" />
              {banner.title && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-right">
                  <h2 className="text-white text-lg font-black drop-shadow-lg animate-in slide-in-from-bottom-2 duration-500">
                    {banner.title}
                  </h2>
                </div>
              )}
            </div>
          )) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">لا توجد بنرات حالياً</div>
          )}

          {/* مؤشرات النقاط (Dots) */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
               {banners.map((_, i) => (
                 <div 
                   key={i} 
                   onClick={() => setCurrentBanner(i)}
                   className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/40'}`}
                 />
               ))}
            </div>
          )}
        </div>
      </div>

      {/* الأقسام */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-sm font-black text-white text-right">تصفح الأقسام</h3>
           <LayoutGrid size={18} className="text-yellow-400" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategoryId(cat.id)} 
              className={`flex flex-col items-center shrink-0 transition-all duration-300 ${activeCategoryId === cat.id ? 'scale-110' : 'opacity-60 scale-95'}`}
            >
              <div className={`w-20 h-20 rounded-[2rem] overflow-hidden border-4 transition-all shadow-lg ${activeCategoryId === cat.id ? 'border-yellow-400 shadow-yellow-400/20' : 'border-transparent bg-white/5'}`}>
                <img src={cat.image} className="w-full h-full object-cover" alt={cat.title} />
              </div>
              <span className={`text-[10px] font-black mt-2 transition-colors ${activeCategoryId === cat.id ? 'text-yellow-400' : 'text-slate-400'}`}>
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* عرض المنتجات - تصميم 4 أعمدة احترافي */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4 px-1">
           <div className="flex flex-col items-end">
              <h3 className="text-xs font-black text-white text-right uppercase tracking-wider">{activeCategory?.title || 'المنتجات'}</h3>
              <div className="w-8 h-1 bg-yellow-400 rounded-full mt-1"></div>
           </div>
           <span className="text-[9px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{filteredProducts.length} عنصر</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-4 gap-3 animate-slide-up">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => { setSelectedProduct(product); setTimeout(() => setIsModalOpen(true), 10); }}
                className="relative group cursor-pointer active:scale-90 transition-all duration-300"
              >
                {/* حاوية الصورة المربعة بحواف دائرية */}
                <div className="w-full aspect-square rounded-[1.2rem] overflow-hidden shadow-lg relative border border-white/5 bg-slate-800/50 backdrop-blur-sm">
                    <img 
                      src={product.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={product.name} 
                    />
                    
                    {/* طبقة شفافة سفلية للاسم (Glassmorphism) */}
                    <div className="absolute bottom-1 inset-x-1 bg-black/40 backdrop-blur-md rounded-[0.8rem] py-1 px-1 border border-white/10">
                        <p className="text-[7px] font-black text-white text-center truncate uppercase tracking-tighter">
                          {product.name}
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-md rounded-[3rem] border border-dashed border-white/10">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-white/20">
                <PlusCircle size={32} />
             </div>
             <p className="text-sm font-black text-white/30">لا توجد منتجات حالياً</p>
          </div>
        )}
      </div>
      
      {isModalOpen && selectedProduct && (
        <PurchaseModal 
          isOpen={isModalOpen} 
          product={selectedProduct} 
          appConfig={appConfig}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }} 
          onConfirm={onPurchase} 
        />
      )}
    </div>
  );
};

export default HomeView;
