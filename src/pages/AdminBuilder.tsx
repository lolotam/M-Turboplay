import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Settings,
  Layout,
  Component,
  Database,
  Server,
  Zap,
  Layers,
  Grid,
  Type,
  Image,
  Link as LinkIcon,
  FileText,
  ShoppingCart,
  Users,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminNavHeader from '@/components/admin/AdminNavHeader';

interface WebsiteSection {
  id: string;
  name: string;
  nameEn: string;
  componentName: string;
  type: 'header' | 'hero' | 'banner' | 'categories' | 'product-carousel' | 'brands' | 'platform' | 'community' | 'delivery' | 'testimonials' | 'newsletter' | 'footer';
  category: 'layout' | 'content' | 'ecommerce' | 'interactive' | 'media' | 'form' | 'utility';
  icon: string;
  description: string;
  descriptionEn: string;
  isVisible: boolean;
  order: number;
  settings: Record<string, any>;
  actualComponent: React.ComponentType<any>;
}

interface CanvasSection extends WebsiteSection {
  instanceId: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

interface PageTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  thumbnail?: string;
  category: 'landing' | 'shop' | 'product' | 'blog' | 'about' | 'contact' | 'custom';
  components: string[];
  isDefault: boolean;
  createdAt: string;
}

const AdminBuilder = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState('sections');
  const [selectedSection, setSelectedSection] = useState<WebsiteSection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [canvasSections, setCanvasSections] = useState<CanvasSection[]>([]);
  const [draggedSection, setDraggedSection] = useState<WebsiteSection | null>(null);

  // Website sections data - these are the actual sections from the homepage
  const [websiteSections] = useState<WebsiteSection[]>([
    {
      id: 'header',
      name: 'الشريط العلوي',
      nameEn: 'Header',
      componentName: 'Header',
      type: 'header',
      category: 'layout',
      icon: 'navigation',
      description: 'شريط التنقل الرئيسي مع الشعار وقائمة التصفح',
      descriptionEn: 'Main navigation bar with logo and menu',
      isVisible: true,
      order: 1,
      settings: {
        sticky: true,
        showCart: true,
        showSearch: true,
        showUserMenu: true
      },
      actualComponent: () => React.createElement('div', { className: 'bg-blue-500 h-16 flex items-center justify-between px-4' },
        React.createElement('div', { className: 'text-white font-bold' }, 'Logo'),
        React.createElement('nav', { className: 'hidden md:flex space-x-6' },
          React.createElement('a', { href: '#', className: 'text-white hover:text-gray-200' }, 'Home'),
          React.createElement('a', { href: '#', className: 'text-white hover:text-gray-200' }, 'Shop'),
          React.createElement('a', { href: '#', className: 'text-white hover:text-gray-200' }, 'About')
        )
      )
    },
    {
      id: 'hero',
      name: 'قسم البطل',
      nameEn: 'Hero Section',
      componentName: 'HeroSection',
      type: 'hero',
      category: 'content',
      icon: 'layout',
      description: 'البانر الرئيسي الكبير للمحتوى المميز',
      descriptionEn: 'Large banner section for featured content',
      isVisible: true,
      order: 2,
      settings: {
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products',
        backgroundImage: '',
        ctaText: 'Shop Now',
        ctaLink: '/shop'
      },
      actualComponent: () => React.createElement('div', { className: 'bg-gradient-to-r from-purple-500 to-pink-500 h-96 flex items-center justify-center' },
        React.createElement('div', { className: 'text-center text-white' },
          React.createElement('h1', { className: 'text-5xl font-bold mb-4' }, 'Welcome to Our Store'),
          React.createElement('p', { className: 'text-xl mb-8' }, 'Discover amazing products'),
          React.createElement('button', { className: 'bg-white text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100' }, 'Shop Now')
        )
      )
    },
    {
      id: 'secondary-banner',
      name: 'البانر الترويجي الثانوي',
      nameEn: 'Secondary Banner',
      componentName: 'SecondaryPromotionalBanner',
      type: 'banner',
      category: 'content',
      icon: 'layout',
      description: 'بانر ترويجي ثانوي للعروض والتخفيضات',
      descriptionEn: 'Secondary promotional banner for offers and discounts',
      isVisible: true,
      order: 3,
      settings: {
        title: 'Special Offer',
        discount: '50%',
        ctaText: 'Shop Now'
      },
      actualComponent: () => React.createElement('div', { className: 'bg-yellow-400 h-32 flex items-center justify-center' },
        React.createElement('div', { className: 'text-center' },
          React.createElement('h2', { className: 'text-2xl font-bold text-black' }, 'Special Offer - 50% OFF'),
          React.createElement('button', { className: 'bg-black text-yellow-400 px-6 py-2 rounded mt-2 font-semibold' }, 'Shop Now')
        )
      )
    },
    {
      id: 'categories',
      name: 'تصنيفات الألعاب',
      nameEn: 'Game Categories',
      componentName: 'GameCategories',
      type: 'categories',
      category: 'content',
      icon: 'grid',
      description: 'عرض تصنيفات الألعاب المتاحة',
      descriptionEn: 'Display available game categories',
      isVisible: true,
      order: 4,
      settings: {
        showIcons: true,
        columns: 4,
        categories: ['Action', 'Adventure', 'RPG', 'Sports']
      },
      actualComponent: () => React.createElement('div', { className: 'bg-gray-100 py-16' },
        React.createElement('div', { className: 'max-w-6xl mx-auto' },
          React.createElement('h2', { className: 'text-3xl font-bold text-center mb-8' }, 'Game Categories'),
          React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
            ['Action', 'Adventure', 'RPG', 'Sports'].map(cat =>
              React.createElement('div', { key: cat, className: 'bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow' },
                React.createElement('div', { className: 'w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center' },
                  React.createElement('span', { className: 'text-white font-bold' }, cat[0])
                ),
                React.createElement('h3', { className: 'font-semibold' }, cat)
              )
            )
          )
        )
      )
    },
    {
      id: 'product-carousel-1',
      name: 'جديد في الألعاب',
      nameEn: 'New Releases',
      componentName: 'ProductCarousel',
      type: 'product-carousel',
      category: 'ecommerce',
      icon: 'grid',
      description: 'عرض الألعاب الجديدة في شكل كاروسيل',
      descriptionEn: 'Display new games in carousel format',
      isVisible: true,
      order: 5,
      settings: {
        title: 'New in Gaming',
        badge: 'New',
        badgeColor: 'bg-green-500',
        viewAllLink: '/new-releases',
        productsCount: 10
      },
      actualComponent: () => React.createElement('div', { className: 'py-16' },
        React.createElement('div', { className: 'max-w-6xl mx-auto' },
          React.createElement('div', { className: 'flex items-center justify-between mb-8' },
            React.createElement('h2', { className: 'text-3xl font-bold' }, 'New in Gaming'),
            React.createElement('span', { className: 'bg-green-500 text-white px-3 py-1 rounded-full text-sm' }, 'New')
          ),
          React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-5 gap-4' },
            Array.from({ length: 5 }).map((_, i) =>
              React.createElement('div', { key: i, className: 'bg-white rounded-lg shadow p-4' },
                React.createElement('div', { className: 'aspect-square bg-gray-200 rounded mb-3' }),
                React.createElement('h3', { className: 'font-semibold text-sm mb-2' }, `New Game ${i + 1}`),
                React.createElement('p', { className: 'text-blue-500 font-bold' }, '$29.99')
              )
            )
          )
        )
      )
    },
    {
      id: 'product-carousel-2',
      name: 'الأكثر مبيعاً',
      nameEn: 'Best Sellers',
      componentName: 'ProductCarousel',
      type: 'product-carousel',
      category: 'ecommerce',
      icon: 'grid',
      description: 'عرض الألعاب الأكثر مبيعاً',
      descriptionEn: 'Display best selling games',
      isVisible: true,
      order: 6,
      settings: {
        title: 'Best Sellers',
        badge: 'Most Popular',
        badgeColor: 'bg-yellow-500',
        viewAllLink: '/best-sellers',
        productsCount: 10
      },
      actualComponent: () => React.createElement('div', { className: 'py-16 bg-gray-50' },
        React.createElement('div', { className: 'max-w-6xl mx-auto' },
          React.createElement('div', { className: 'flex items-center justify-between mb-8' },
            React.createElement('h2', { className: 'text-3xl font-bold' }, 'Best Sellers'),
            React.createElement('span', { className: 'bg-yellow-500 text-white px-3 py-1 rounded-full text-sm' }, 'Most Popular')
          ),
          React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-5 gap-4' },
            Array.from({ length: 5 }).map((_, i) =>
              React.createElement('div', { key: i, className: 'bg-white rounded-lg shadow p-4' },
                React.createElement('div', { className: 'aspect-square bg-gray-200 rounded mb-3' }),
                React.createElement('h3', { className: 'font-semibold text-sm mb-2' }, `Best Seller ${i + 1}`),
                React.createElement('p', { className: 'text-green-500 font-bold' }, '$19.99')
              )
            )
          )
        )
      )
    },
    {
      id: 'brands',
      name: 'العلامات التجارية المميزة',
      nameEn: 'Featured Brands',
      componentName: 'FeaturedBrands',
      type: 'brands',
      category: 'content',
      icon: 'image',
      description: 'عرض العلامات التجارية الشريكة',
      descriptionEn: 'Display partner brands',
      isVisible: true,
      order: 7,
      settings: {
        brands: ['Brand A', 'Brand B', 'Brand C'],
        showLogos: true
      },
      actualComponent: () => React.createElement('div', { className: 'py-16' },
        React.createElement('div', { className: 'max-w-6xl mx-auto' },
          React.createElement('h2', { className: 'text-3xl font-bold text-center mb-8' }, 'Featured Brands'),
          React.createElement('div', { className: 'flex justify-center items-center gap-8 flex-wrap' },
            ['Brand A', 'Brand B', 'Brand C'].map(brand =>
              React.createElement('div', { key: brand, className: 'w-32 h-16 bg-gray-200 rounded flex items-center justify-center' },
                React.createElement('span', { className: 'font-semibold' }, brand)
              )
            )
          )
        )
      )
    },
    {
      id: 'footer',
      name: 'تذييل الموقع',
      nameEn: 'Footer',
      componentName: 'Footer',
      type: 'footer',
      category: 'layout',
      icon: 'layout',
      description: 'تذييل الموقع مع الروابط والمعلومات',
      descriptionEn: 'Site footer with links and information',
      isVisible: true,
      order: 8,
      settings: {
        sections: ['About', 'Support', 'Legal'],
        socialLinks: ['Facebook', 'Twitter', 'Instagram'],
        copyright: '© 2024 Our Store. All rights reserved.'
      },
      actualComponent: () => React.createElement('div', { className: 'bg-gray-800 text-white py-12' },
        React.createElement('div', { className: 'max-w-6xl mx-auto' },
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-8' },
            React.createElement('div', {},
              React.createElement('h3', { className: 'font-bold mb-4' }, 'About'),
              React.createElement('ul', { className: 'space-y-2 text-sm text-gray-300' },
                React.createElement('li', {}, React.createElement('a', { href: '#', className: 'hover:text-white' }, 'About Us')),
                React.createElement('li', {}, React.createElement('a', { href: '#', className: 'hover:text-white' }, 'Contact'))
              )
            ),
            React.createElement('div', {},
              React.createElement('h3', { className: 'font-bold mb-4' }, 'Support'),
              React.createElement('ul', { className: 'space-y-2 text-sm text-gray-300' },
                React.createElement('li', {}, React.createElement('a', { href: '#', className: 'hover:text-white' }, 'Help Center')),
                React.createElement('li', {}, React.createElement('a', { href: '#', className: 'hover:text-white' }, 'Returns'))
              )
            ),
            React.createElement('div', { className: 'md:col-span-2 text-center' },
              React.createElement('p', { className: 'text-sm text-gray-300' }, '© 2024 Our Store. All rights reserved.')
            )
          )
        )
      )
    }
  ]);

  const [templates] = useState<PageTemplate[]>([
    {
      id: '1',
      name: 'Home Page',
      nameEn: 'Home Page',
      description: 'Default homepage layout with hero and featured products',
      descriptionEn: 'Default homepage layout with hero and featured products',
      category: 'landing',
      components: ['1', '2', '3'],
      isDefault: true,
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Shop Page',
      nameEn: 'Shop Page',
      description: 'Product listing page with filters and categories',
      descriptionEn: 'Product listing page with filters and categories',
      category: 'shop',
      components: ['1', '3'],
      isDefault: false,
      createdAt: '2025-01-01T00:00:00.000Z'
    }
  ]);

  const filteredSections = websiteSections.filter(section => {
    const matchesSearch = isRTL
      ? section.name.toLowerCase().includes(searchTerm.toLowerCase())
      : section.nameEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getComponentIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      navigation: <LinkIcon className="w-5 h-5" />,
      layout: <Layout className="w-5 h-5" />,
      grid: <Grid className="w-5 h-5" />,
      image: <Image className="w-5 h-5" />,
      text: <Type className="w-5 h-5" />,
      component: <Component className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />,
      server: <Server className="w-5 h-5" />,
      zap: <Zap className="w-5 h-5" />,
      layers: <Layers className="w-5 h-5" />
    };
    return icons[iconName] || <Component className="w-5 h-5" />;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      layout: <Layout className="w-4 h-4" />,
      content: <FileText className="w-4 h-4" />,
      ecommerce: <ShoppingCart className="w-4 h-4" />,
      interactive: <Zap className="w-4 h-4" />,
      media: <Image className="w-4 h-4" />,
      form: <Settings className="w-4 h-4" />,
      utility: <Component className="w-4 h-4" />
    };
    return icons[category] || <Component className="w-4 h-4" />;
  };

  const addSectionToCanvas = (section: WebsiteSection) => {
    const canvasSection: CanvasSection = {
      ...section,
      instanceId: `${section.id}-${Date.now()}`,
      isEditing: false,
      hasUnsavedChanges: false
    };

    setCanvasSections(prev => [...prev, canvasSection]);
    setSelectedSection(null);

    toast({
      title: isRTL ? 'تمت إضافة القسم' : 'Section Added',
      description: isRTL
        ? `تم إضافة ${isRTL ? section.name : section.nameEn} إلى اللوحة`
        : `${isRTL ? section.name : section.nameEn} has been added to the canvas`,
    });
  };

  const removeSectionFromCanvas = (instanceId: string) => {
    setCanvasSections(prev => prev.filter(section => section.instanceId !== instanceId));
  };

  const updateSectionSettings = (instanceId: string, settings: Record<string, any>) => {
    setCanvasSections(prev =>
      prev.map(section =>
        section.instanceId === instanceId
          ? { ...section, settings: { ...section.settings, ...settings }, hasUnsavedChanges: true }
          : section
      )
    );
  };

  const renderCanvasSection = (section: CanvasSection) => {
    const style: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      marginBottom: '20px',
      border: section.isEditing ? '3px solid #3b82f6' : '2px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      minHeight: '80px'
    };

    const getSectionPreview = () => {
      switch (section.type) {
        case 'header':
          return (
            <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      {isRTL ? section.name : section.nameEn}
                    </div>
                    <div className="text-xs opacity-90">
                      {isRTL ? 'شريط التنقل الرئيسي' : 'Main Navigation Bar'}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {isRTL ? 'رأس' : 'Header'}
                </Badge>
              </div>
            </div>
          );
        case 'hero':
          return (
            <div className="w-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Layout className="w-8 h-8" />
              </div>
              <div className="font-bold text-lg mb-2">
                {isRTL ? section.name : section.nameEn}
              </div>
              <div className="space-y-1 text-sm opacity-90">
                <div>{isRTL ? 'عنوان مميز كبير' : 'Large Featured Title'}</div>
                <div>{isRTL ? 'وصف جذاب' : 'Compelling Description'}</div>
                <div>{isRTL ? 'زر العمل الرئيسي' : 'Primary Action Button'}</div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mt-3">
                {isRTL ? 'بطل' : 'Hero'}
              </Badge>
            </div>
          );
        case 'footer':
          return (
            <div className="w-full bg-gray-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      {isRTL ? section.name : section.nameEn}
                    </div>
                    <div className="text-xs opacity-90">
                      {isRTL ? 'روابط ومعلومات الموقع' : 'Site Links & Information'}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {isRTL ? 'تذييل' : 'Footer'}
                </Badge>
              </div>
            </div>
          );
        default:
          return (
            <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                    {getComponentIcon(section.icon)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-800">
                      {isRTL ? section.name : section.nameEn}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isRTL ? section.description : section.descriptionEn}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white border-gray-300">
                  {section.category}
                </Badge>
              </div>
            </div>
          );
      }
    };

    return (
      <div
        key={section.instanceId}
        style={style}
        className="canvas-section group relative"
        onClick={(e) => {
          e.stopPropagation();
          // Handle section selection for editing
        }}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              removeSectionFromCanvas(section.instanceId);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
        {section.hasUnsavedChanges && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-xs">
              {isRTL ? 'غير محفوظ' : 'Unsaved'}
            </Badge>
          </div>
        )}
        <div className="p-4">
          {getSectionPreview()}
        </div>
      </div>
    );
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if the click is on the canvas background (not on child elements)
    if (selectedSection && e.target === e.currentTarget) {
      addSectionToCanvas(selectedSection);
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSection) {
      addSectionToCanvas(draggedSection);
      setDraggedSection(null);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSectionClick = (section: WebsiteSection) => {
    setSelectedSection(section);
  };

  const handleSectionDragStart = (section: WebsiteSection) => {
    setDraggedSection(section);
  };

  const handleSectionDragEnd = () => {
    setDraggedSection(null);
  };

  const handleTemplateUse = (template: PageTemplate) => {
    const templateSections = template.components
      .map(id => websiteSections.find(sec => sec.id === id))
      .filter(Boolean) as WebsiteSection[];

    const canvasSections: CanvasSection[] = templateSections.map((sec, index) => ({
      ...sec,
      instanceId: `${sec.id}-${Date.now()}-${index}`,
      isEditing: false,
      hasUnsavedChanges: false
    }));

    setCanvasSections(canvasSections);

    toast({
      title: isRTL ? 'تم تطبيق القالب' : 'Template Applied',
      description: isRTL
        ? `تم تطبيق قالب ${isRTL ? template.name : template.nameEn} على اللوحة`
        : `Template ${isRTL ? template.name : template.nameEn} has been applied to the canvas`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {isRTL ? 'منشئ الصفحات' : 'Page Builder'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إنشاء وتخصيص صفحات الموقع' : 'Create and customize website pages'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {selectedSection && (
              <Button
                variant="outline"
                onClick={() => selectedSection && addSectionToCanvas(selectedSection)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة القسم' : 'Add Section'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                // Test function to add a sample section
                const testSection: CanvasSection = {
                  ...websiteSections[0], // Use first section as template
                  instanceId: `test-${Date.now()}`,
                  isEditing: false,
                  hasUnsavedChanges: false
                };
                setCanvasSections(prev => [...prev, testSection]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'اختبار' : 'Test'}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              {isRTL ? 'معاينة' : 'Preview'}
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Builder Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {isRTL ? 'المكونات' : 'Components'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? 'البحث في المكونات...' : 'Search components...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isRTL ? 'pr-10' : 'pl-10'}
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                    <SelectItem value="layout">{isRTL ? 'التخطيط' : 'Layout'}</SelectItem>
                    <SelectItem value="content">{isRTL ? 'المحتوى' : 'Content'}</SelectItem>
                    <SelectItem value="ecommerce">{isRTL ? 'التجارة الإلكترونية' : 'E-commerce'}</SelectItem>
                    <SelectItem value="interactive">{isRTL ? 'التفاعلي' : 'Interactive'}</SelectItem>
                    <SelectItem value="media">{isRTL ? 'الوسائط' : 'Media'}</SelectItem>
                    <SelectItem value="form">{isRTL ? 'النماذج' : 'Forms'}</SelectItem>
                    <SelectItem value="utility">{isRTL ? 'الأدوات المساعدة' : 'Utility'}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sections List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredSections.map((section) => (
                    <div
                      key={section.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedSection?.id === section.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleSectionClick(section)}
                      draggable
                      onDragStart={() => handleSectionDragStart(section)}
                      onDragEnd={handleSectionDragEnd}
                    >
                      <div className="flex items-center gap-3">
                        {getComponentIcon(section.icon)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {isRTL ? section.name : section.nameEn}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isRTL ? section.description : section.descriptionEn}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(section.category)}
                          <span className="mr-1">
                            {section.category}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  {isRTL ? 'لوحة التصميم' : 'Design Canvas'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed border-muted rounded-lg min-h-[500px] bg-muted/20 relative overflow-hidden ${
                    selectedSection ? 'border-primary border-solid' : ''
                  }`}
                  onClick={handleCanvasClick}
                  onDrop={handleCanvasDrop}
                  onDragOver={handleCanvasDragOver}
                  style={{
                    backgroundImage: selectedSection
                      ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
                      : 'none'
                  }}
                >
                  {canvasSections.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          {selectedSection
                            ? (isRTL ? 'اسحب القسم هنا أو انقر لإضافته' : 'Drag section here or click to add')
                            : (isRTL ? 'اختر قسماً لبدء التصميم' : 'Select a section to start designing')
                          }
                        </p>
                        <p className="text-sm">
                          {selectedSection
                            ? (isRTL
                                ? 'اسحب القسم من الشريط الجانبي أو انقر هنا لإضافته مباشرة'
                                : 'Drag the section from the sidebar or click here to add it directly')
                            : (isRTL
                                ? 'اختر قسماً من الشريط الجانبي واسحبه إلى هذه المنطقة لبدء بناء صفحتك'
                                : 'Choose a section from the sidebar and drag it to this area to start building your page')
                          }
                        </p>
                        {selectedSection && (
                          <Button
                            className="mt-4"
                            onClick={() => addSectionToCanvas(selectedSection)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {isRTL ? 'إضافة القسم' : 'Add Section'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full p-4 overflow-y-auto">
                      {canvasSections.map((section) => (
                        <div key={section.instanceId}>
                          {renderCanvasSection(section)}
                        </div>
                      ))}
                      {/* Empty drop zone at the bottom for adding more sections */}
                      <div
                        className="border-2 border-dashed border-primary/50 rounded-lg h-32 flex items-center justify-center mt-4 bg-primary/5"
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedSection) {
                            addSectionToCanvas(draggedSection);
                          }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <div className="text-center text-primary">
                          <Plus className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">
                            {isRTL ? 'أسقط هنا لإضافة قسم آخر' : 'Drop here to add another section'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Templates Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {isRTL ? 'قوالب الصفحات' : 'Page Templates'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                    <Layout className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">
                    {isRTL ? template.name : template.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isRTL ? template.description : template.descriptionEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={template.isDefault ? 'default' : 'outline'}>
                      {template.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" onClick={() => handleTemplateUse(template)}>
                        {isRTL ? 'استخدام' : 'Use'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminBuilder;