
import React, { useState } from 'react';
import { Mail, User, MapPin, Camera, Lock, ShieldCheck, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { UserState, AppConfig } from '../types';

interface LoginViewProps {
  onLogin: (email: string, password: string, userData?: Partial<UserState>, isSignup?: boolean) => Promise<void>;
  appName: string;
  logoUrl: string;
  appConfig: AppConfig; // أضفنا appConfig للحصول على الخلفية
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, appName, logoUrl, appConfig }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('مصر 🇪🇬');
  const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/user/200');
  const [isLoading, setIsLoading] = useState(false);

  const countries = [
    { name: 'مصر 🇪🇬', value: 'مصر 🇪🇬' },
    { name: 'السعودية 🇸🇦', value: 'السعودية 🇸🇦' },
    { name: 'العراق 🇮🇶', value: 'العراق 🇮🇶' },
    { name: 'تركيا 🇹🇷', value: 'تركيا 🇹🇷' },
    { name: 'الإمارات 🇦🇪', value: 'الإمارات 🇦🇪' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) return alert('يرجى إدخال بريد إلكتروني صحيح');
    if (password.length < 6) return alert('كلمة السر يجب أن تكون 6 أحرف على الأقل');

    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        if (username.length < 3) throw new Error('اسم المستخدم قصير جداً');
        await onLogin(cleanEmail, password, { name: username, profilePic, country }, true);
      } else {
        await onLogin(cleanEmail, password, undefined, false);
      }
    } catch (error: any) {
      alert(error.message || "فشل تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  // تنسيق الخلفية الديناميكية
  const loginStyle: React.CSSProperties = {
    backgroundImage: appConfig.loginBackgroundImageUrl 
      ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${appConfig.loginBackgroundImageUrl})` 
      : 'none',
    backgroundColor: appConfig.loginBackgroundImageUrl ? 'transparent' : '#0000FF',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className="min-h-[100dvh] w-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar py-10 px-6 rtl font-['Cairo'] relative transition-all duration-1000" 
      style={loginStyle}
      dir="rtl"
    >
      {/* العناكب الملونة (تظهر فقط إذا لم تكن هناك خلفية مخصصة) */}
      {!appConfig.loginBackgroundImageUrl && (
        <>
          <div className="fixed top-[-5%] right-[-5%] w-80 h-80 bg-yellow-400/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="fixed bottom-[-5%] left-[-5%] w-80 h-80 bg-red-600/20 rounded-full blur-[80px] pointer-events-none"></div>
        </>
      )}

      <div className="w-full max-w-[420px] z-10 my-auto animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-white rounded-[1.5rem] p-3 shadow-2xl mb-3 border border-white/20">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">{appName}</h1>
        </div>

        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-[1.8rem] mb-6 border border-white/10 w-full">
          <button onClick={() => setActiveTab('signup')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.6rem] font-black text-[10px] transition-all ${activeTab === 'signup' ? 'bg-yellow-400 text-slate-900' : 'text-white/60'}`}><UserPlus size={14} /> إنشاء حساب</button>
          <button onClick={() => setActiveTab('login')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.6rem] font-black text-[10px] transition-all ${activeTab === 'login' ? 'bg-yellow-400 text-slate-900' : 'text-white/60'}`}><LogIn size={14} /> تسجيل دخول</button>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl relative overflow-hidden w-full">
          {activeTab === 'signup' && (
            <div className="flex flex-col items-center mb-6 animate-in slide-in-from-top-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-[1.8rem] border-4 border-yellow-400 overflow-hidden bg-white/5 shadow-xl"><img src={profilePic} className="w-full h-full object-cover" alt="Avatar" /></div>
                <label className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 p-1.5 rounded-xl shadow-lg cursor-pointer border-2 border-slate-900 active:scale-90 transition-transform"><Camera size={14} /><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></label>
              </div>
            </div>
          )}

          <div className="space-y-3.5">
            {activeTab === 'signup' && (
              <div className="relative group animate-in slide-in-from-right-4">
                <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-12 text-right text-white text-sm font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-white/30" />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
              </div>
            )}
            <div className="relative group">
              <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-12 text-right text-white text-sm font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-white/30" />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
            </div>
            <div className="relative group">
              <input type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-12 text-right text-white text-sm font-bold outline-none focus:border-yellow-400 transition-all placeholder:text-white/30" />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
            </div>
            {activeTab === 'signup' && (
              <div className="relative group animate-in slide-in-from-right-4">
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full h-13 bg-white/5 border border-white/10 rounded-2xl px-12 text-right text-white text-sm font-bold outline-none focus:border-yellow-400 transition-all appearance-none">{countries.map((c, idx) => <option key={idx} value={c.value} className="text-slate-900">{c.name}</option>)}</select>
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" size={16} />
              </div>
            )}
            <button onClick={handleSubmit} disabled={isLoading} className="w-full h-14 bg-yellow-400 text-slate-900 rounded-2xl font-black text-sm shadow-xl shadow-yellow-400/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{activeTab === 'signup' ? 'إكمال التسجيل' : 'دخول للمنصة'} <ShieldCheck size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
