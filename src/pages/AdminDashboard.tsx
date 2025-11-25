import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useDiscountCodes } from '@/contexts/DiscountCodesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  LogOut,
  Settings,
  Ticket
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import DatabaseSetup from '@/components/DatabaseSetup';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Get real data from context providers
  const { products } = useProducts();
  const { orders } = useOrders();
  const { messages } = useMessages();
  const { discountCodes } = useDiscountCodes();

  const handleLogout = () => {
    logout();
    toast({
      title: isRTL ? "تم تسجيل الخروج" : "Logged Out",
      description: isRTL ? "تم تسجيل الخروج بنجاح" : "You have been logged out successfully",
    });
  };

  // Calculate real statistics from database
  const statistics = useMemo(() => {
    // Calculate total revenue from orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Count total orders
    const totalOrders = orders.length;

    // Count pending/processing orders
    const pendingOrders = orders.filter(
      order => order.status === 'pending' || order.status === 'processing'
    ).length;

    // Count total products
    const totalProducts = products.length;

    // Count active products
    const activeProducts = products.filter(p => p.status === 'active').length;

    // Count total messages
    const totalMessages = messages.length;

    // Count unread messages
    const unreadMessages = messages.filter(m => m.status === 'unread').length;

    // Count total discount codes
    const totalDiscountCodes = discountCodes.length;

    // Count active discount codes
    const activeDiscountCodes = discountCodes.filter(dc => dc.isActive).length;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      activeProducts,
      totalMessages,
      unreadMessages,
      totalDiscountCodes,
      activeDiscountCodes
    };
  }, [products, orders, messages, discountCodes]);

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

  // Products chart data
  const productsChartData = useMemo(() => {
    // Category distribution
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
      const category = isRTL ? p.category : p.categoryEn || p.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    // Stock status
    const stockData = [
      { name: isRTL ? 'نشط' : 'Active', value: products.filter(p => p.status === 'active').length },
      { name: isRTL ? 'غير نشط' : 'Inactive', value: products.filter(p => p.status === 'inactive').length }
    ];

    // Product types
    const typeData = [
      { name: isRTL ? 'رقمي' : 'Digital', value: products.filter(p => p.type === 'digital').length },
      { name: isRTL ? 'فعلي' : 'Physical', value: products.filter(p => p.type === 'physical').length }
    ];

    return { categoryData, stockData, typeData };
  }, [products, isRTL]);

  // Orders chart data
  const ordersChartData = useMemo(() => {
    // Orders by status
    const statusData = [
      { name: isRTL ? 'معلق' : 'Pending', value: orders.filter(o => o.status === 'pending').length },
      { name: isRTL ? 'قيد المعالجة' : 'Processing', value: orders.filter(o => o.status === 'processing').length },
      { name: isRTL ? 'تم الشحن' : 'Shipped', value: orders.filter(o => o.status === 'shipped').length },
      { name: isRTL ? 'تم التسليم' : 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
      { name: isRTL ? 'ملغي' : 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length }
    ].filter(item => item.value > 0);

    // Revenue by payment method
    const paymentRevenue: Record<string, number> = {};
    orders.forEach(o => {
      const method = o.paymentMethod || 'Unknown';
      paymentRevenue[method] = (paymentRevenue[method] || 0) + o.total;
    });
    const paymentData = Object.entries(paymentRevenue).map(([name, value]) => ({
      name: isRTL ? (name === 'cash' ? 'نقدي' : name === 'card' ? 'بطاقة' : name) : name,
      value: parseFloat(value.toFixed(3))
    }));

    // Orders over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const ordersByDate: Record<string, number> = {};
    orders.forEach(o => {
      const date = new Date(o.createdAt).toISOString().split('T')[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
    });

    const ordersTimeData = last7Days.map(date => ({
      date: new Date(date).toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', { month: 'short', day: 'numeric' }),
      orders: ordersByDate[date] || 0
    }));

    return { statusData, paymentData, ordersTimeData };
  }, [orders, isRTL]);

  // Messages chart data
  const messagesChartData = useMemo(() => {
    // Read vs Unread
    const readData = [
      { name: isRTL ? 'مقروء' : 'Read', value: messages.filter(m => m.status === 'read' || m.status === 'replied' || m.status === 'resolved' || m.status === 'archived').length },
      { name: isRTL ? 'غير مقروء' : 'Unread', value: messages.filter(m => m.status === 'unread').length }
    ];

    // Priority distribution
    const priorityData = [
      { name: isRTL ? 'منخفض' : 'Low', value: messages.filter(m => m.priority === 'low').length },
      { name: isRTL ? 'متوسط' : 'Medium', value: messages.filter(m => m.priority === 'medium').length },
      { name: isRTL ? 'عالي' : 'High', value: messages.filter(m => m.priority === 'high').length },
      { name: isRTL ? 'عاجل' : 'Urgent', value: messages.filter(m => m.priority === 'urgent').length }
    ].filter(item => item.value > 0);

    return { readData, priorityData };
  }, [messages, isRTL]);

  // Discount codes chart data
  const discountCodesChartData = useMemo(() => {
    // Type distribution
    const typeData = [
      { name: isRTL ? 'نسبة مئوية' : 'Percentage', value: discountCodes.filter(dc => dc.type === 'percentage').length },
      { name: isRTL ? 'قيمة ثابتة' : 'Fixed', value: discountCodes.filter(dc => dc.type === 'fixed').length }
    ];

    // Usage statistics (top 5 most used)
    const usageData = discountCodes
      .map(dc => ({
        name: dc.code,
        used: dc.usedCount || 0,
        available: (dc.usageLimit || 0) - (dc.usedCount || 0)
      }))
      .sort((a, b) => b.used - a.used)
      .slice(0, 5);

    return { typeData, usageData };
  }, [discountCodes, isRTL]);

  // Dashboard cards with real data
  const stats = [
    {
      title: isRTL ? 'إجمالي المبيعات' : 'Total Sales',
      value: `${statistics.totalRevenue.toFixed(3)} ${isRTL ? 'د.ك' : 'KWD'}`,
      change: `${statistics.totalOrders} ${isRTL ? 'طلب' : 'orders'}`,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: isRTL ? 'الطلبات' : 'Orders',
      value: statistics.totalOrders.toString(),
      change: `${statistics.pendingOrders} ${isRTL ? 'معلق' : 'pending'}`,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: isRTL ? 'المنتجات' : 'Products',
      value: statistics.totalProducts.toString(),
      change: `${statistics.activeProducts} ${isRTL ? 'نشط' : 'active'}`,
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: isRTL ? 'الرسائل' : 'Messages',
      value: statistics.totalMessages.toString(),
      change: `${statistics.unreadMessages} ${isRTL ? 'غير مقروء' : 'unread'}`,
      icon: MessageSquare,
      color: 'text-red-600'
    },
    {
      title: isRTL ? 'أكواد الخصم' : 'Discount Codes',
      value: statistics.totalDiscountCodes.toString(),
      change: `${statistics.activeDiscountCodes} ${isRTL ? 'نشط' : 'active'}`,
      icon: Ticket,
      color: 'text-emerald-600'
    },
    {
      title: isRTL ? 'معدل الطلب' : 'Avg. Order',
      value: statistics.totalOrders > 0
        ? `${(statistics.totalRevenue / statistics.totalOrders).toFixed(3)} ${isRTL ? 'د.ك' : 'KWD'}`
        : '0.000 KWD',
      change: isRTL ? 'متوسط القيمة' : 'Average value',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
  ];

  const quickActions = [
    {
      title: isRTL ? 'إدارة المنتجات' : 'Manage Products',
      description: isRTL ? 'إضافة، تعديل، وحذف المنتجات' : 'Add, edit, and delete products',
      icon: Package,
      href: '/admin/products'
    },
    {
      title: isRTL ? 'إدارة الطلبات' : 'Manage Orders',
      description: isRTL ? 'عرض وإدارة الطلبات' : 'View and manage orders',
      icon: ShoppingCart,
      href: '/admin/orders'
    },
    {
      title: isRTL ? 'الرسائل' : 'Messages',
      description: isRTL ? 'عرض والرد على الرسائل' : 'View and respond to messages',
      icon: MessageSquare,
      href: '/admin/messages'
    },
    {
      title: isRTL ? 'أكواد الخصم' : 'Discount Codes',
      description: isRTL ? 'إنشاء وإدارة أكواد الخصم' : 'Create and manage discount codes',
      icon: Ticket,
      href: '/admin/discount-codes'
    },
    {
      title: isRTL ? 'إدارة المستخدمين' : 'User Management',
      description: isRTL ? 'إدارة حسابات المستخدمين والصلاحيات' : 'Manage user accounts and permissions',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: isRTL ? 'التقارير' : 'Reports',
      description: isRTL ? 'عرض التقارير والإحصائيات' : 'View reports and analytics',
      icon: BarChart3,
      href: '/admin/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation Header */}
      <AdminNavHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {isRTL ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            {isRTL ? `مرحباً، ${user?.name || 'المدير'}` : `Welcome, ${user?.name || 'Admin'}`}
            <Badge variant="secondary" className="px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {isRTL ? 'متصل' : 'Online'}
            </Badge>
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <Badge variant="secondary" className={`mt-2 ${stat.color}`}>
                        {stat.change}
                      </Badge>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted/20`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analytics & Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isRTL ? 'التحليلات والرسوم البيانية' : 'Analytics & Charts'}
          </h2>

          {/* Products Analytics */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">
              {isRTL ? 'تحليلات المنتجات' : 'Products Analytics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'توزيع الفئات' : 'Category Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={productsChartData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productsChartData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Stock Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'حالة المخزون' : 'Stock Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={productsChartData.stockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Product Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'أنواع المنتجات' : 'Product Types'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={productsChartData.typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productsChartData.typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Orders & Revenue Analytics */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">
              {isRTL ? 'تحليلات الطلبات والإيرادات' : 'Orders & Revenue Analytics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Orders Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'الطلبات خلال الأسبوع' : 'Orders Over Time (7 Days)'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={ordersChartData.ordersTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue by Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'الإيرادات حسب طريقة الدفع' : 'Revenue by Payment Method'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ordersChartData.paymentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(2)} KWD`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersChartData.paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(3)} KWD`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'توزيع حالة الطلبات' : 'Order Status Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ordersChartData.statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Messages & Discount Codes Analytics */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">
              {isRTL ? 'تحليلات الرسائل وأكواد الخصم' : 'Messages & Discount Codes Analytics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Messages Read vs Unread */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'حالة الرسائل' : 'Messages Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={messagesChartData.readData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {messagesChartData.readData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Messages Priority Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'توزيع أولوية الرسائل' : 'Messages Priority Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={messagesChartData.priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ff7c7c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Discount Codes Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'أنواع أكواد الخصم' : 'Discount Code Types'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={discountCodesChartData.typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {discountCodesChartData.typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Discount Codes Usage Statistics */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base">
                    {isRTL ? 'إحصائيات استخدام أكواد الخصم (الأكثر استخداماً)' : 'Discount Codes Usage Statistics (Top 5)'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={discountCodesChartData.usageData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="used" fill="#82ca9d" name={isRTL ? 'مستخدم' : 'Used'} />
                      <Bar dataKey="available" fill="#8884d8" name={isRTL ? 'متاح' : 'Available'} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => navigate(action.href)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Database Setup - Temporary for testing */}
        <DatabaseSetup />

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">
                  {isRTL ? 'طلب جديد تم استلامه #1234' : 'New order received #1234'}
                </span>
                <span className="text-xs text-muted-foreground mr-auto">
                  {isRTL ? 'منذ 5 دقائق' : '5 minutes ago'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  {isRTL ? 'تم تحديث منتج: دليل الحيوانات الشامل' : 'Product updated: Complete Pets Guide'}
                </span>
                <span className="text-xs text-muted-foreground mr-auto">
                  {isRTL ? 'منذ 15 دقيقة' : '15 minutes ago'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">
                  {isRTL ? 'عميل جديد سجل في المتجر' : 'New customer registered'}
                </span>
                <span className="text-xs text-muted-foreground mr-auto">
                  {isRTL ? 'منذ 30 دقيقة' : '30 minutes ago'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;