import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingCart, Globe, Menu, X, Shield, User, LogOut, LogIn, Crown, ChevronDown, Gamepad2, Monitor, Tv, Smartphone, CreditCard, Calendar, Headphones } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CurrencySelector from "@/components/CurrencySelector";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { state } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const categoriesMenu = {
    label: isRTL ? 'الفئات' : 'Categories',
    href: '/categories',
    megaMenu: [
      {
        title: isRTL ? 'الألعاب حسب المنصة' : 'Games by Platform',
        items: [
          { label: isRTL ? 'بلايستيشن' : 'PlayStation', href: '/playstation-games', icon: <Gamepad2 className="w-4 h-4" />, count: '2,500+' },
          { label: isRTL ? 'إكس بوكس' : 'Xbox', href: '/xbox-games', icon: <Gamepad2 className="w-4 h-4" />, count: '1,800+' },
          { label: isRTL ? 'نينتندو' : 'Nintendo', href: '/nintendo-games', icon: <Tv className="w-4 h-4" />, count: '1,200+' },
          { label: isRTL ? 'العاب الكمبيوتر' : 'PC Games', href: '/pc-games', icon: <Monitor className="w-4 h-4" />, count: '5,000+' },
          { label: isRTL ? 'ألعاب الجوال' : 'Mobile Games', href: '/mobile-games', icon: <Smartphone className="w-4 h-4" />, count: '800+' },
        ]
      },
      {
        title: isRTL ? 'الفئات الخاصة' : 'Special Categories',
        items: [
          { label: isRTL ? 'البطاقات الرقمية' : 'Digital Gift Cards', href: '/gift-cards', icon: <CreditCard className="w-4 h-4" />, count: '150+' },
          { label: isRTL ? 'الطلب المسبق' : 'Pre-Orders', href: '/pre-orders', icon: <Calendar className="w-4 h-4" />, count: '50+' },
          { label: isRTL ? 'الألعاب الكلاسيكية' : 'Retro Gaming', href: '/retro-gaming', icon: <Gamepad2 className="w-4 h-4" />, count: '300+' },
          { label: isRTL ? 'إكسسوارات الألعاب' : 'Gaming Accessories', href: '/game-accessories', icon: <Headphones className="w-4 h-4" />, count: '800+' },
        ]
      }
    ]
  };

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.shop'), href: '/shop' },
    categoriesMenu,
    { label: isRTL ? 'إصدارات جديدة' : 'New Releases', href: '/new-releases' },
    { label: isRTL ? 'العروض' : 'Deals', href: '/deals' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className={`flex items-center ${isRTL ? 'gap-6' : 'gap-4'}`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo 1.png" alt="M-Turboplay Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient font-baloo">
                M-Turboplay
              </h1>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'متجر الألعاب الرقمية' : 'Digital Gaming Store'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.href || item.label} className="relative">
                {'megaMenu' in item ? (
                  // Mega Menu Item
                  <button
                    onMouseEnter={() => setActiveMegaMenu(item.label)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                    className="flex items-center gap-2 text-foreground hover:text-[#A855F7] transition-colors duration-300 font-medium py-2"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeMegaMenu === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  // Regular Menu Item
                  <button
                    onClick={() => item.href.startsWith('#') ? document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' }) : navigate(item.href)}
                    className="text-foreground hover:text-[#A855F7] transition-colors duration-300 font-medium py-2"
                  >
                    {item.label}
                  </button>
                )}

                {/* Mega Menu Dropdown */}
                {'megaMenu' in item && activeMegaMenu === item.label && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[600px] bg-[#1A1A2E] border border-[#A855F7]/30 rounded-xl shadow-purple-glow p-6 z-50"
                    onMouseEnter={() => setActiveMegaMenu(item.label)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <div className="grid grid-cols-2 gap-8">
                      {item.megaMenu.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4 className="text-white font-bold text-lg mb-4 border-b border-[#A855F7]/30 pb-2">
                            {section.title}
                          </h4>
                          <div className="space-y-3">
                            {section.items.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => {
                                  navigate(subItem.href);
                                  setActiveMegaMenu(null);
                                }}
                                className="w-full flex items-center justify-between text-[#C4B5FD] hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-all duration-300 p-2 rounded-lg text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[#A855F7]">{subItem.icon}</span>
                                  <span className="font-medium">{subItem.label}</span>
                                </div>
                                <Badge variant="secondary" className="bg-[#A855F7]/20 text-[#A855F7] text-xs">
                                  {subItem.count}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Featured Product Preview */}
                    <div className="mt-6 pt-6 border-t border-[#A855F7]/30">
                      <h5 className="text-white font-bold mb-4">
                        {isRTL ? 'منتجات مميزة' : 'Featured Products'}
                      </h5>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-[#6B46C1]/10 to-[#A855F7]/10 rounded-lg p-3 border border-[#A855F7]/20 hover:border-[#A855F7]/50 transition-colors cursor-pointer"
                            onClick={() => navigate('/product/featured-' + i)}
                          >
                            <div className="aspect-square bg-gradient-to-br from-[#A855F7]/20 to-[#E935C1]/20 rounded mb-2"></div>
                            <h6 className="text-white text-sm font-medium truncate">
                              {isRTL ? `لعبة مميزة ${i}` : `Featured Game ${i}`}
                            </h6>
                            <p className="text-[#10B981] text-sm font-bold">
                              {Math.floor(Math.random() * 50) + 20} {isRTL ? 'ر.س' : 'SAR'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="relative"
            >
              <Globe className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'EN' : 'ع'}
            </Button>

            {/* Currency Selector */}
            <CurrencySelector variant="badge" className="hidden sm:flex" />

            {/* User Authentication */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-20 truncate">{user.name}</span>
                    {isAdmin() && <Crown className="w-3 h-3 text-yellow-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    {isRTL ? 'الملف الشخصي' : 'Profile'}
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <Shield className="w-4 h-4 mr-2" />
                      {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                <LogIn className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
            )}

            {/* Shopping Cart */}
            <Button variant="outline" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {state.totalItems > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground"
                >
                  {state.totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    item.href.startsWith('#') ? document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' }) : navigate(item.href);
                  }}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
              {/* Mobile Authentication */}
              <div className="pt-2 border-t border-border/50">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{user.name}</span>
                          {isAdmin() && <Crown className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {isRTL ? 'الملف الشخصي' : 'Profile'}
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/admin/dashboard');
                        }}
                        className="w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors duration-300 font-medium py-2 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;