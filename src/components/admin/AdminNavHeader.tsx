import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  User,
  Users,
  Ticket,
  Bot,
  Sparkles,
  FolderTree,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useDiscountCodes } from '@/contexts/DiscountCodesContext';

const AdminNavHeader = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isRTL = i18n.language === 'ar';

  // Get real data from context providers
  const { products } = useProducts();
  const { orders } = useOrders();
  const { messages } = useMessages();
  const { discountCodes } = useDiscountCodes();

  // Calculate real badge counts
  const badgeCounts = useMemo(() => {
    const totalProducts = products.length;
    const pendingOrders = orders.filter(
      order => order.status === 'pending' || order.status === 'processing'
    ).length;
    const unreadMessages = messages.filter(m => m.status === 'unread').length;
    const totalDiscountCodes = discountCodes.length;

    // For user management, we'll use a placeholder count
    // In a real app, this would come from a UsersContext
    const totalUsers = 0; // TODO: Add UsersContext

    return {
      products: totalProducts,
      orders: pendingOrders,
      messages: unreadMessages,
      discountCodes: totalDiscountCodes,
      users: totalUsers
    };
  }, [products, orders, messages, discountCodes]);

  const navItems = [
    {
      label: isRTL ? 'لوحة التحكم' : 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: isRTL ? 'الفئات' : 'Categories',
      path: '/admin/categories',
      icon: FolderTree,
    },
    {
      label: isRTL ? 'المنشئ' : 'Builder',
      path: '/admin/builder',
      icon: Wrench,
    },
    {
      label: isRTL ? 'المنتجات' : 'Products',
      path: '/admin/products',
      icon: Package,
      badge: badgeCounts.products > 0 ? badgeCounts.products.toString() : undefined
    },
    {
      label: isRTL ? 'مساعد AI' : 'AI Assistant',
      path: '/admin/ai-chat',
      icon: Bot,
      badge: 'NEW',
      highlight: true
    },
    {
      label: isRTL ? 'الطلبات' : 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      badge: badgeCounts.orders > 0 ? badgeCounts.orders.toString() : undefined
    },
    {
      label: isRTL ? 'الرسائل' : 'Messages',
      path: '/admin/messages',
      icon: MessageSquare,
      badge: badgeCounts.messages > 0 ? badgeCounts.messages.toString() : undefined
    },
    {
      label: isRTL ? 'أكواد الخصم' : 'Discount Codes',
      path: '/admin/discount-codes',
      icon: Ticket,
      badge: badgeCounts.discountCodes > 0 ? badgeCounts.discountCodes.toString() : undefined
    },
    {
      label: isRTL ? 'إدارة المستخدمين' : 'User Management',
      path: '/admin/users',
      icon: Users,
      badge: badgeCounts.users > 0 ? badgeCounts.users.toString() : undefined
    },
    {
      label: isRTL ? 'التقارير' : 'Reports',
      path: '/admin/reports',
      icon: BarChart3,
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="border-b border-border bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/logo 1.png" alt="M-Turboplay Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="leading-tight">
                  <div className="text-xl font-bold text-gradient font-baloo">
                    M-TurboPlay
                  </div>
                  <div className="text-sm font-bold text-gradient font-baloo">
                    {isRTL ? 'لوحة تحكم' : 'Admin'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'إدارة متجر الألعاب' : 'Gaming Store Management'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`relative ${isRTL ? 'ml-1' : 'mr-1'} ${
                    isActive ? 'bg-primary text-primary-foreground' : ''
                  } ${item.highlight ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {item.label}
                  {item.highlight && <Sparkles className="w-3 h-3 ml-1 text-yellow-500" />}
                  {item.badge && (
                    <Badge
                      className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} ${item.badge === 'NEW' ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-destructive'} text-white min-w-5 h-5 text-xs flex items-center justify-center`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button variant="ghost" size="sm" onClick={handleLanguageToggle}>
              <span className="text-sm font-medium">
                {i18n.language === 'ar' ? 'EN' : 'ع'}
              </span>
            </Button>

            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user?.email || (isRTL ? 'المدير' : 'Admin')}
              </span>
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/settings')}
              title={isRTL ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm`}>
                {isRTL ? 'خروج' : 'Logout'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`relative flex flex-col items-center gap-1 min-w-16 h-auto py-2 ${
                    isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground min-w-4 h-4 text-xs flex items-center justify-center p-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavHeader;