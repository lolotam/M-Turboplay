import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrdersContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ShoppingCart,
  Search,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Loader2,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/contexts/OrdersContext';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { exportOrdersToCSV } from '@/lib/csvExport';

const AdminOrders = () => {
  const { orders, isLoading, updateOrderStatus, searchOrders, getOrderStats, deleteOrder } = useOrders();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredOrders = searchOrders(searchQuery, selectedStatus, dateFrom, dateTo);
  const stats = getOrderStats();

  // Check if all visible orders are selected
  const areAllOrdersSelected = useMemo(() => {
    return filteredOrders.length > 0 && filteredOrders.every(order => selectedOrders.includes(order.id));
  }, [filteredOrders, selectedOrders]);

  // Check if some but not all orders are selected
  const areSomeOrdersSelected = useMemo(() => {
    return selectedOrders.length > 0 && !areAllOrdersSelected;
  }, [selectedOrders, areAllOrdersSelected]);

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: {
        variant: 'outline',
        label: isRTL ? 'في الانتظار' : 'Pending'
      },
      processing: {
        variant: 'secondary',
        label: isRTL ? 'قيد المعالجة' : 'Processing'
      },
      shipped: {
        variant: 'default',
        label: isRTL ? 'تم الشحن' : 'Shipped'
      },
      delivered: {
        variant: 'default',
        label: isRTL ? 'تم التسليم' : 'Delivered'
      },
      cancelled: {
        variant: 'destructive',
        label: isRTL ? 'ملغي' : 'Cancelled'
      },
      refunded: {
        variant: 'destructive',
        label: isRTL ? 'مسترد' : 'Refunded'
      }
    };

    const config = statusConfig[status] || { variant: 'outline' as const, label: status };
    
    return (
      <div className="flex flex-col gap-1">
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
        {paymentStatus && paymentStatus !== 'paid' && (
          <Badge variant="outline" className="text-xs">
            {paymentStatus === 'pending' ? (isRTL ? 'دفع معلق' : 'Payment Pending') :
             paymentStatus === 'failed' ? (isRTL ? 'فشل الدفع' : 'Payment Failed') :
             paymentStatus === 'refunded' ? (isRTL ? 'مسترد' : 'Refunded') : paymentStatus}
          </Badge>
        )}
      </div>
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) return;

    const confirmMessage = isRTL
      ? `هل أنت متأكد من حذف ${selectedOrders.length} طلب؟`
      : `Are you sure you want to delete ${selectedOrders.length} order(s)?`;

    if (confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        // Delete each selected order
        for (const orderId of selectedOrders) {
          await deleteOrder(orderId);
        }
        setSelectedOrders([]);
        toast({
          title: isRTL ? 'تم حذف الطلبات' : 'Orders Deleted',
          description: isRTL ? 'تم حذف الطلبات المحددة بنجاح' : 'Selected orders have been deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting orders:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل في حذف الطلبات' : 'Failed to delete orders',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus: Order['status']) => {
    if (selectedOrders.length === 0) return;
    try {
      for (const orderId of selectedOrders) {
        await updateOrderStatus(orderId, newStatus);
      }
      setSelectedOrders([]);
      toast({
        title: isRTL ? 'تم تحديث الحالة' : 'Status Updated',
        description: isRTL ? 'تم تحديث حالة الطلبات المحددة' : 'Selected orders status has been updated',
      });
    } catch (error) {
      console.error('Error updating orders status:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث حالة الطلبات' : 'Failed to update orders status',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        toast({
          title: isRTL ? 'تم تحديث حالة الطلب' : 'Order Status Updated',
          description: isRTL ? 'تم تحديث حالة الطلب بنجاح' : 'Order status has been updated successfully',
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث حالة الطلب' : 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ?
      date.toLocaleDateString('ar-KW-u-ca-gregory') :
      date.toLocaleDateString('en-US');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-KW-u-ca-gregory' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                <ShoppingCart className="w-6 h-6" />
                {isRTL ? 'إدارة الطلبات' : 'Orders Management'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إدارة جميع طلبات العملاء' : 'Manage all customer orders'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {isRTL ? `${selectedOrders.length} محدد` : `${selectedOrders.length} selected`}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isRTL ? 'حذف المحدد' : 'Delete Selected'}
                  </Button>
                  <Select onValueChange={(value) => handleBulkStatusUpdate(value as Order['status'])}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={isRTL ? 'تحديث الحالة' : 'Update Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">{isRTL ? 'قيد المعالجة' : 'Processing'}</SelectItem>
                      <SelectItem value="shipped">{isRTL ? 'مشحون' : 'Shipped'}</SelectItem>
                      <SelectItem value="delivered">{isRTL ? 'مكتمل' : 'Delivered'}</SelectItem>
                      <SelectItem value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => exportOrdersToCSV(filteredOrders, isRTL)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'تصدير CSV' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                  </p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'في الانتظار' : 'Pending'}
                  </p>
                  <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <RefreshCw className="w-4 h-4 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'قيد المعالجة' : 'Processing'}
                  </p>
                  <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
                </div>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'مشحون' : 'Shipped'}
                  </p>
                  <p className="text-xl font-bold text-purple-600">{stats.shipped}</p>
                </div>
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'مكتمل' : 'Delivered'}
                  </p>
                  <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRTL ? 'الإيرادات' : 'Revenue'}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {stats.totalRevenue.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                  </p>
                </div>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4`} />
                <Input
                  placeholder={isRTL ? 'البحث في الطلبات...' : 'Search orders...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isRTL ? 'pr-10' : 'pl-10'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'حالة الطلب' : 'Order Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Statuses'}</SelectItem>
                  <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                  <SelectItem value="processing">{isRTL ? 'قيد المعالجة' : 'Processing'}</SelectItem>
                  <SelectItem value="shipped">{isRTL ? 'مشحون' : 'Shipped'}</SelectItem>
                  <SelectItem value="delivered">{isRTL ? 'مكتمل' : 'Delivered'}</SelectItem>
                  <SelectItem value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder={isRTL ? 'من تاريخ' : 'From Date'}
              />

              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder={isRTL ? 'إلى تاريخ' : 'To Date'}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {filteredOrders.length} {isRTL ? 'طلب' : 'orders found'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isRTL ? 'قائمة الطلبات' : 'Orders List'}</span>
              <Badge variant="secondary">{orders.length} {isRTL ? 'طلب' : 'orders'}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                {isRTL ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">{isRTL ? '#' : '#'}</TableHead>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={areAllOrdersSelected}
                        indeterminate={areSomeOrdersSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>{isRTL ? 'رقم الطلب' : 'Order #'}</TableHead>
                    <TableHead>{isRTL ? 'العميل' : 'Customer'}</TableHead>
                    <TableHead>{isRTL ? 'المنتجات' : 'Items'}</TableHead>
                    <TableHead>{isRTL ? 'المبلغ' : 'Total'}</TableHead>
                    <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{isRTL ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead className="text-right">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.isDigitalOnly ? 
                            (isRTL ? 'رقمي' : 'Digital') : 
                            (isRTL ? 'فعلي' : 'Physical')
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customer.firstName} {order.customer.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm">
                              {isRTL ? item.title : item.titleEn} 
                              {item.quantity > 1 && ` x${item.quantity}`}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 2} {isRTL ? 'منتج آخر' : 'more items'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {order.total.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                        </div>
                        {order.promoDiscount > 0 && (
                          <div className="text-xs text-green-600">
                            -{order.promoDiscount}% {isRTL ? 'خصم' : 'discount'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status, order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/orders/view/${order.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={updatingOrderId === order.id}>
                                {updatingOrderId === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="w-4 h-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                {isRTL ? 'تحديث الحالة' : 'Update Status'}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {order.status !== 'processing' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(order.id, 'processing')}
                                >
                                  {isRTL ? 'قيد المعالجة' : 'Processing'}
                                </DropdownMenuItem>
                              )}
                              {order.status !== 'shipped' && !order.isDigitalOnly && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                >
                                  {isRTL ? 'مشحون' : 'Shipped'}
                                </DropdownMenuItem>
                              )}
                              {order.status !== 'delivered' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                >
                                  {isRTL ? 'مكتمل' : 'Delivered'}
                                </DropdownMenuItem>
                              )}
                              {order.status !== 'cancelled' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                  className="text-destructive"
                                >
                                  {isRTL ? 'إلغاء' : 'Cancel'}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredOrders.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? 'لا توجد طلبات' : 'No orders found'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'جرب تغيير معايير البحث أو الفلاتر' : 'Try changing your search criteria or filters'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminOrders;