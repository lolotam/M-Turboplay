import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/contexts/ProductsContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Calendar,
  Download,
  ArrowLeft,
  Loader2,
  Eye,
  Star,
  Activity,
  Target,
  Zap,
  Clock,
  MousePointer,
  ShoppingCart as CartIcon,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminReports = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { orders, isLoading: ordersLoading } = useOrders();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const analytics = useMemo(() => {
    if (!products || !orders) return null;

    const now = new Date();
    const daysAgo = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));

    const recentOrders = orders.filter(order => 
      new Date(order.createdAt || order.orderDate || Date.now()) >= daysAgo
    );

    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = recentOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const categorySales = products.reduce((acc, product) => {
      const productOrders = recentOrders.filter(order => 
        order.items.some(item => item.id === product.id)
      );
      const categoryRevenue = productOrders.reduce((sum, order) => {
        const productItems = order.items.filter(item => item.id === product.id);
        return sum + productItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      }, 0);
      
      acc[product.category] = (acc[product.category] || 0) + categoryRevenue;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = products
      .map(product => {
        const productOrders = recentOrders.filter(order =>
          order.items.some(item => item.id === product.id)
        );
        const totalSold = productOrders.reduce((sum, order) => {
          const productItems = order.items.filter(item => item.id === product.id);
          return sum + productItems.reduce((itemSum, item) => itemSum + item.quantity, 0);
        }, 0);
        const revenue = productOrders.reduce((sum, order) => {
          const productItems = order.items.filter(item => item.id === product.id);
          return sum + productItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);
        
        return {
          ...product,
          totalSold,
          revenue
        };
      })
      .filter(product => product.totalSold > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const orderStatusBreakdown = recentOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      categorySales,
      topProducts,
      orderStatusBreakdown,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length
    };
  }, [products, orders, dateRange]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'guide':
        return isRTL ? 'أدلة رقمية' : 'Digital Guides';
      case 'physical':
        return isRTL ? 'منتجات فعلية' : 'Physical Products';
      case 'consultation':
        return isRTL ? 'جلسات إرشادية' : 'Consultation Sessions';
      default:
        return category;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: isRTL ? 'قيد الانتظار' : 'Pending',
      processing: isRTL ? 'قيد المعالجة' : 'Processing',
      shipped: isRTL ? 'تم الشحن' : 'Shipped',
      delivered: isRTL ? 'تم التسليم' : 'Delivered',
      cancelled: isRTL ? 'ملغي' : 'Cancelled'
    };
    return labels[status] || status;
  };

  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isRTL ? 'جاري تحميل التقارير...' : 'Loading reports...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation Header */}
      <AdminNavHeader />
      
      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                {isRTL ? 'التقارير والإحصائيات' : 'Reports & Analytics'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'تتبع أداء المتجر والمبيعات' : 'Track store performance and sales'}
              </p>
            </div>
            
            <Button className="btn-hero" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              {isRTL ? 'تصدير التقرير' : 'Export Report'}
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</SelectItem>
                  <SelectItem value="30">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
                  <SelectItem value="90">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
                  <SelectItem value="365">{isRTL ? 'آخر سنة' : 'Last year'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</SelectItem>
                  <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
                  <SelectItem value="products">{isRTL ? 'المنتجات' : 'Products'}</SelectItem>
                  <SelectItem value="orders">{isRTL ? 'الطلبات' : 'Orders'}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {isRTL ? `آخر ${dateRange} يوم` : `Last ${dateRange} days`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {analytics && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {analytics.totalRevenue.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        {analytics.totalOrders}
                      </p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
                      </p>
                      <p className="text-2xl font-bold text-success">
                        {analytics.averageOrderValue.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-success" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">-2.1%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'المنتجات النشطة' : 'Active Products'}
                      </p>
                      <p className="text-2xl font-bold text-warning">
                        {analytics.activeProducts}
                      </p>
                    </div>
                    <Package className="w-8 h-8 text-warning" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? `من أصل ${analytics.totalProducts}` : `of ${analytics.totalProducts} total`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {isRTL ? 'أفضل المنتجات مبيعاً' : 'Top Selling Products'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? 'المنتج' : 'Product'}</TableHead>
                        <TableHead>{isRTL ? 'المبيعات' : 'Sales'}</TableHead>
                        <TableHead>{isRTL ? 'الإيرادات' : 'Revenue'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.topProducts.slice(0, 5).map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold">
                                {index + 1}
                              </span>
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">
                                  {isRTL ? product.title : product.titleEn}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getCategoryLabel(product.category)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{product.totalSold}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.revenue.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Category Sales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {isRTL ? 'المبيعات حسب الفئة' : 'Sales by Category'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analytics.categorySales)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, revenue]) => {
                      const percentage = analytics.totalRevenue > 0 
                        ? (revenue / analytics.totalRevenue * 100) 
                        : 0;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {getCategoryLabel(category)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {revenue.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% {isRTL ? 'من إجمالي الإيرادات' : 'of total revenue'}
                          </p>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* Order Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    {isRTL ? 'حالة الطلبات' : 'Order Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analytics.orderStatusBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .map(([status, count]) => {
                      const percentage = analytics.totalOrders > 0 
                        ? (count / analytics.totalOrders * 100) 
                        : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{getStatusLabel(status)}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/products')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {isRTL ? 'إدارة المنتجات' : 'Manage Products'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isRTL ? 'عرض الطلبات' : 'View Orders'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/messages')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isRTL ? 'الرسائل' : 'Messages'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/products/add')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {isRTL ? 'إضافة منتج جديد' : 'Add New Product'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminReports;