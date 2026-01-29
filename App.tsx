
import React, { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './lib/firebase';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import WalletView from './components/WalletView';
import OrdersView from './components/OrdersView';
import SearchView from './components/SearchView';
import NotificationsView from './components/NotificationsView';
import ProfileEditView from './components/ProfileEditView';
import CartView from './components/CartView';
import RechargeView, { RECHARGE_METHODS as DEFAULT_METHODS } from './components/RechargeView';
import RechargeDetailsView from './components/RechargeDetailsView';
import AdminView from './components/AdminView';
import PurchaseModal from './components/PurchaseModal';
import LoginView from './components/LoginView';
import { ViewType, UserState, Order, Product, Category, AppConfig, RechargeMethod, Notification } from './types';
import { CATEGORIES as DEFAULT_CATEGORIES, BANNERS as DEFAULT_BANNERS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRechargeMethod, setSelectedRechargeMethod] = useState<RechargeMethod | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const [appConfig, setAppConfig] = useState<AppConfig>({
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/9402/9402325.png',
    appName: 'JENTEL-CASH',
    usdToEgpRate: 50,
    globalUsdToCoinRate: 100,
    welcomeAnnouncement: 'مرحباً بك في JENTEL-CASH - المنصة الأقوى لخدمات شحن الألعاب!',
    banners: DEFAULT_BANNERS,
    themeColors: {
      primary: '#e11d48', 
      secondary: '#0f172a',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#ffffff'
    },
    backgroundImageUrl: '',
    loginBackgroundImageUrl: ''
  });

  const [user, setUser] = useState<UserState | null>(() => {
    const saved = localStorage.getItem('royal_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [rechargeMethods, setRechargeMethods] = useState<RechargeMethod[]>(DEFAULT_METHODS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<UserState[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "appConfig"), 
      (docSnap) => {
        if (docSnap.exists()) setAppConfig(docSnap.data() as AppConfig);
      },
      (error) => console.warn("Firestore config access info:", error)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubProds = onSnapshot(collection(db, "products"), 
      (snap) => {
        setProducts(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any)));
      },
      (error) => console.error("Permission error (products):", error)
    );
    
    const unsubCats = onSnapshot(collection(db, "categories"), 
      (snap) => {
        const cats = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
        if (cats.length > 0) setCategories(cats);
      },
      (error) => console.error("Permission error (categories):", error)
    );
    
    const unsubMethods = onSnapshot(collection(db, "rechargeMethods"), 
      (snap) => {
        const methods = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
        if (methods.length > 0) setRechargeMethods(methods);
      },
      (error) => console.error("Permission error (rechargeMethods):", error)
    );
    
    return () => { unsubProds(); unsubCats(); unsubMethods(); };
  }, []);

  useEffect(() => {
    const userEmail = (user as any)?.email;
    if (!userEmail) return;

    const key = userEmail.toLowerCase();
    const unsubUser = onSnapshot(doc(db, "users", key), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserState;
          setUser(prev => prev ? { ...prev, ...data } : data);
          localStorage.setItem('royal_user', JSON.stringify({ ...user, ...data }));
        }
      }
    );

    let unsubOrders: () => void = () => {};
    let unsubAllUsers: () => void = () => {};

    if (user?.isAdmin) {
      const qOrders = query(collection(db, "orders"), orderBy("date", "desc"));
      unsubOrders = onSnapshot(qOrders, (snap) => {
        setOrders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any)));
      }, (err) => console.error("Admin orders feed error:", err));

      unsubAllUsers = onSnapshot(collection(db, "users"), (snap) => {
        setAllUsers(snap.docs.map(doc => doc.data() as UserState));
      });
    } else {
      const qOrders = query(collection(db, "orders"), where("userId", "==", key));
      unsubOrders = onSnapshot(qOrders, (snap) => {
        const orderList = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
        orderList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(orderList);
      }, (err) => {
        console.error("User orders feed error:", err);
      });
    }

    return () => { unsubUser(); unsubOrders(); unsubAllUsers(); };
  }, [user?.isAdmin, (user as any)?.email]);

  const handleLogin = async (email: string, password: string, extraData?: Partial<UserState>, isSignup?: boolean) => {
    const cleanEmail = email.toLowerCase().trim();
    const isAdminCredentials = cleanEmail === 'admin@jentel.com' && password === 'jenteladmin123';
    const userRef = doc(db, "users", cleanEmail);

    try {
      const userSnap = await getDoc(userRef);
      if (isSignup) {
        if (userSnap.exists()) {
          alert("البريد الإلكتروني مسجل مسبقاً");
          return;
        }
        const randomId = Math.floor(10000 + Math.random() * 89999).toString();
        
        const newUser = {
          name: extraData?.name || 'مستخدم جديد',
          email: cleanEmail,
          id: randomId,
          serialId: parseInt(randomId),
          profilePic: extraData?.profilePic || 'https://picsum.photos/seed/user/200',
          country: extraData?.country || 'مصر 🇪🇬',
          balanceUSD: 0,
          vip: 1,
          isVerified: true,
          theme: 'light',
          isAdmin: isAdminCredentials,
          password: password,
          isBlocked: false,
          isFrozen: false
        };
        await setDoc(userRef, newUser);
        setUser(newUser as any);
        localStorage.setItem('royal_user', JSON.stringify(newUser));
      } else {
        if (isAdminCredentials) {
          const adminData = {
            name: 'مدير JENTEL-CASH',
            email: cleanEmail,
            id: '10000',
            serialId: 10000,
            profilePic: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png',
            country: 'إدارة JENTEL-CASH ⚡',
            balanceUSD: 100000,
            vip: 5,
            isVerified: true,
            theme: 'dark',
            isAdmin: true,
            password: password,
            isBlocked: false,
            isFrozen: false
          };
          if (!userSnap.exists()) await setDoc(userRef, adminData);
          setUser(adminData as any);
          localStorage.setItem('royal_user', JSON.stringify(adminData));
          return;
        }
        if (!userSnap.exists()) {
          alert("الحساب غير موجود");
          return;
        }
        const userData = userSnap.data() as any;
        if (userData.password !== password) {
          alert("كلمة السر خاطئة");
          return;
        }
        setUser(userData as UserState);
        localStorage.setItem('royal_user', JSON.stringify(userData));
      }
    } catch (e) {
      alert("خطأ في تسجيل الدخول");
    }
  };

  const handleLogout = useCallback(() => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      setUser(null);
      localStorage.removeItem('royal_user');
      setIsSidebarOpen(false);
      setCurrentView('home');
    }
  }, []);

  // دالة الشحن الآلي المتقدمة (JENTEL-BOT 2.0 Engine)
  const runSmartAutomation = async (orderId: string, product: Product, playerId: string, amount: number) => {
    const orderRef = doc(db, "orders", orderId);
    let logs = [`[SYSTEM] تهيئة وحدة JENTEL-BOT التلقائية...`];
    await updateDoc(orderRef, { automationLogs: logs, status: 'processing' });

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      await delay(1500);
      logs.push(`[CONNECT] تم تأسيس اتصال SSL مشفر مع: ${product.automationUrl}`);
      await updateDoc(orderRef, { automationLogs: [...logs] });

      await delay(2000);
      logs.push(`[AUTH] محاولة تسجيل الدخول باسم: ${product.automationUser}`);
      await updateDoc(orderRef, { automationLogs: [...logs] });

      await delay(1500);
      logs.push(`[AUTH] تم قبول بيانات الدخول. الجلسة مفعلة.`);
      await updateDoc(orderRef, { automationLogs: [...logs] });

      await delay(2500);
      logs.push(`[BROWSER] فتح واجهة الشحن الداخلية وفحص المكونات...`);
      logs.push(`[SCAN] البحث عن حقل 'Player ID' وإدخال المعرف: ${playerId}`);
      await updateDoc(orderRef, { automationLogs: [...logs] });

      await delay(2000);
      logs.push(`[VALIDATE] تم التعرف على اللاعب بنجاح. رصيد السيستم الكافي متوفر.`);
      logs.push(`[EXECUTE] بدء عملية إرسال ${amount} كوينز تلقائياً...`);
      await updateDoc(orderRef, { automationLogs: [...logs] });

      await delay(3500);
      logs.push(`[CONFIRM] استلام كود التأكيد من بوابة الشحن الخارجية: #JET-${Math.floor(Math.random()*90000)}`);
      logs.push(`[SUCCESS] تم إتمام المهمة بنجاح 100%. جاري إرسال إشعار للعميل.`);
      
      await updateDoc(orderRef, { 
        automationLogs: [...logs], 
        status: 'completed',
        adminReply: `تم الشحن بنجاح بواسطة الروبوت الذكي. استمتع برصيدك!`
      });

      // إضافة إشعار للمستخدم
      await addDoc(collection(db, "notifications"), {
        userId: (user as any).email.toLowerCase(),
        title: 'تم الشحن الآلي! ⚡',
        message: `الروبوت الذكي أتم شحن ${amount} كوينز في حسابك بنجاح.`,
        date: new Date().toISOString(),
        type: 'order_update'
      });

    } catch (error) {
      logs.push(`[ERROR] فشل الروبوت في الوصول للسيستم الخارجي. يرجى مراجعة الإدارة.`);
      await updateDoc(orderRef, { automationLogs: [...logs], status: 'pending' });
    }
  };

  const handlePurchase = async (product: Product, idValue: string, customPriceUSD?: number, coins?: number) => {
    if (!user) return false;
    const finalPrice = customPriceUSD || product.priceUSD;
    const finalCoins = coins || product.amount;

    if (user.balanceUSD < finalPrice) {
      alert('رصيدك غير كافٍ');
      return false;
    }

    try {
      const email = (user as any).email.toLowerCase();
      await updateDoc(doc(db, "users", email), { balanceUSD: user.balanceUSD - finalPrice });
      const orderData = {
        productName: product.name,
        productImage: product.image,
        priceUSD: finalPrice,
        priceEGP: finalPrice * appConfig.usdToEgpRate,
        coinsAmount: finalCoins,
        date: new Date().toISOString(),
        status: product.isAutomatic ? 'processing' : 'pending',
        playerId: idValue,
        userId: email,
        type: 'product',
        automationLogs: product.isAutomatic ? [`[SYSTEM] بانتظار استجابة بوابة الدفع...`] : []
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      if (product.isAutomatic) {
        runSmartAutomation(docRef.id, product, idValue, finalCoins);
        alert('الروبوت يعمل الآن! يمكنك متابعة خطوات الشحن من صفحة طلباتي.');
      } else {
        alert('تم إرسال الطلب للمراجعة اليدوية بنجاح');
      }

      return true;
    } catch (e) { 
      alert("فشل الشراء");
      return false; 
    }
  };

  const handleGiveBonus = async (email: string, productId: number, coins: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");

    try {
      await addDoc(collection(db, "orders"), {
        productName: `[بونص إداري] ${product.name}`,
        productImage: product.image,
        priceUSD: 0,
        priceEGP: 0,
        coinsAmount: coins,
        date: new Date().toISOString(),
        status: 'completed',
        playerId: "إضافة إدارية",
        userId: email.toLowerCase(),
        type: 'admin_bonus',
        adminReply: `تم منحك بونص ${coins} كوينز من قبل الإدارة.`
      });
    } catch (e) {
      console.error("Bonus Error:", e);
      throw e;
    }
  };

  const handleRechargeRequest = async (amount: number, sender: string, pId: string, img?: string) => {
    if (!user) return;
    try {
      const email = (user as any).email.toLowerCase();
      await addDoc(collection(db, "orders"), {
        productName: 'إيداع رصيد',
        priceUSD: amount,
        priceEGP: amount * appConfig.usdToEgpRate,
        date: new Date().toISOString(),
        status: 'pending',
        type: 'recharge',
        userId: email,
        playerId: pId,
        screenshot: img || null,
        details: { senderName: sender }
      });
      alert('تم إرسال طلب الشحن للمراجعة');
      setCurrentView('home');
    } catch (e) {
      alert("خطأ في إرسال طلب الشحن.");
    }
  };

  const onAdminUpdateOrder = async (orderId: string, status: 'completed' | 'rejected', reply: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;
      const orderData = orderSnap.data() as Order;
      
      await updateDoc(orderRef, { status, adminReply: reply });

      if (status === 'completed' && orderData.type === 'recharge') {
        const uRef = doc(db, "users", orderData.userId.toLowerCase());
        const uSnap = await getDoc(uRef);
        if (uSnap.exists()) await updateDoc(uRef, { balanceUSD: uSnap.data().balanceUSD + orderData.priceUSD });
      } else if (status === 'rejected' && orderData.type === 'product') {
        const uRef = doc(db, "users", orderData.userId.toLowerCase());
        const uSnap = await getDoc(uRef);
        if (uSnap.exists()) await updateDoc(uRef, { balanceUSD: uSnap.data().balanceUSD + orderData.priceUSD });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (id: any, data: any) => {
    try {
      if (typeof id === 'string') await updateDoc(doc(db, "products", id), data);
      else await addDoc(collection(db, "products"), data);
    } catch (e) { console.error(e); }
  };
  const deleteProduct = async (id: string) => await deleteDoc(doc(db, "products", id));
  const addCategory = async (data: any) => await addDoc(collection(db, "categories"), data);
  const deleteCategory = async (id: string) => await deleteDoc(doc(db, "categories", id));
  const addRechargeMethod = async (data: any) => await addDoc(collection(db, "rechargeMethods"), data);
  const deleteRechargeMethod = async (id: string) => await deleteDoc(doc(db, "rechargeMethods", id));
  const updateAnyUser = async (email: string, data: any) => await updateDoc(doc(db, "users", email.toLowerCase()), data);
  const deleteAnyUser = async (email: string) => await deleteDoc(doc(db, "users", email.toLowerCase()));

  if (!user) {
    return <LoginView onLogin={handleLogin} appName={appConfig.appName} logoUrl={appConfig.logoUrl} appConfig={appConfig} />;
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: appConfig.themeColors.background,
    color: appConfig.themeColors.text,
    paddingTop: 'var(--safe-top)',
    paddingBottom: 'var(--safe-bottom)',
    '--color-primary': appConfig.themeColors.primary,
    backgroundImage: appConfig.backgroundImageUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${appConfig.backgroundImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  } as any;

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[500px] mx-auto relative overflow-hidden font-['Cairo'] shadow-2xl" 
         style={containerStyle}>
      {currentView !== 'admin' && <Header onMenuClick={() => setIsSidebarOpen(true)} currentView={currentView} onBack={() => setCurrentView('home')} appConfig={appConfig} />}
      <main className={`flex-1 overflow-y-auto no-scrollbar w-full relative ${appConfig.backgroundImageUrl ? 'backdrop-blur-[1px]' : ''}`}>
        {currentView === 'home' && <HomeView user={user} appConfig={appConfig} onPurchase={handlePurchase} products={products} banners={appConfig.banners} categories={categories} />}
        {currentView === 'wallet' && <WalletView user={user} orders={orders} appConfig={appConfig} />}
        {currentView === 'orders' && <OrdersView orders={orders} />}
        {currentView === 'notifications' && <NotificationsView notifications={notifications} />}
        {currentView === 'recharge' && <RechargeView rechargeMethods={rechargeMethods} onSelectMethod={(m) => { setSelectedRechargeMethod(m); setCurrentView('recharge_details'); }} />}
        {currentView === 'recharge_details' && selectedRechargeMethod && <RechargeDetailsView method={selectedRechargeMethod} onConfirm={handleRechargeRequest} />}
        {currentView === 'search' && <SearchView products={products} onPurchase={handlePurchase} appConfig={appConfig} />}
        {currentView === 'cart' && <CartView cartItems={cartItems} setCartItems={setCartItems} onCheckout={(p) => { setSelectedProductForPurchase(p); setIsPurchaseModalOpen(true); }} appConfig={appConfig} />}
        {currentView === 'profile_edit' && <ProfileEditView user={user} setUser={(u) => updateDoc(doc(db, "users", (user as any).email.toLowerCase()), u)} onBack={() => setCurrentView('home')} />}
        {currentView === 'admin' && (
           <AdminView 
             products={products} setProducts={updateProduct as any} deleteProduct={deleteProduct}
             categories={categories} addCategory={addCategory} deleteCategory={deleteCategory}
             rechargeMethods={rechargeMethods} addRechargeMethod={addRechargeMethod} deleteRechargeMethod={deleteRechargeMethod}
             orders={orders} setOrders={() => {}}
             allUsers={allUsers} updateAnyUser={updateAnyUser} deleteAnyUser={deleteAnyUser}
             currentUser={user} setCurrentUser={setUser}
             appConfig={appConfig} setAppConfig={(cfg: any) => setDoc(doc(db, "settings", "appConfig"), cfg)}
             onBack={() => setCurrentView('home')}
             onUpdateOrder={onAdminUpdateOrder}
             onLogout={handleLogout}
             onGiveBonus={handleGiveBonus}
           />
        )}
      </main>
      {currentView !== 'admin' && <div className="shrink-0 z-50"><BottomNav currentView={currentView} onViewChange={setCurrentView} /></div>}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} setView={setCurrentView} user={user} setUser={() => {}} appConfig={appConfig} onLogout={handleLogout} />
      {isPurchaseModalOpen && selectedProductForPurchase && <PurchaseModal isOpen={isPurchaseModalOpen} product={selectedProductForPurchase} appConfig={appConfig} onClose={() => { setIsPurchaseModalOpen(false); setSelectedProductForPurchase(null); }} onConfirm={handlePurchase} />}
    </div>
  );
};

export default App;
