
export type ViewType = 'home' | 'wallet' | 'orders' | 'notifications' | 'search' | 'cart' | 'profile_edit' | 'admin' | 'recharge' | 'recharge_details';
export type ThemeType = 'light' | 'dark';

export interface Category {
  id: number;
  title: string;
  image: string;
}

export interface Banner {
  id: number;
  url: string;
  title: string;
}

export interface Product {
  id: number;
  name: string;
  priceUSD: number;
  priceEGP: number;
  usdToCoinRate: number;
  amount: number;
  image: string;
  color: string;
  categoryId: number;
  isCustomAmount?: boolean;
  // إعدادات الأتمتة والربط الذكي
  automationUrl?: string;
  automationUser?: string;
  automationPass?: string;
  isAutomatic?: boolean;
}

export interface Order {
  id: string;
  productName: string;
  productImage?: string;
  priceUSD: number;
  priceEGP: number;
  coinsAmount: number;
  date: string;
  status: 'completed' | 'pending' | 'rejected' | 'processing';
  playerId?: string;
  userId: string;
  type?: 'product' | 'recharge' | 'category_order' | 'admin_bonus';
  adminReply?: string;
  screenshot?: string;
  details?: any;
  automationLogs?: string[];
}

export interface RechargeMethod {
  id: number;
  label: string;
  icon: string;
  color: string;
  iban?: string;
  recipientName?: string;
  recipientName2?: string;
  instructions?: string;
  currencyIcon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'recharge_success' | 'system' | 'order_update';
}

export interface UserState {
  name: string;
  id: string;
  serialId?: number;
  vip: number;
  balanceUSD: number;
  profilePic: string;
  country: string;
  isVerified: boolean;
  theme: ThemeType;
  isAdmin?: boolean;
  isBlocked?: boolean;
  blockedUntil?: string;
  isFrozen?: boolean;
  email: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

export interface AppConfig {
  logoUrl: string;
  appName: string;
  usdToEgpRate: number;
  globalUsdToCoinRate: number;
  welcomeAnnouncement: string;
  banners: Banner[];
  themeColors: ThemeColors;
  backgroundImageUrl?: string;
  loginBackgroundImageUrl?: string;
}
