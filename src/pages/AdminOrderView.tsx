import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders, Order } from '@/contexts/OrdersContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Printer,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminOrderView = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus, addOrderNote } = useOrders();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isRTL ? 'الطلب غير موجود' : 'Order Not Found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isRTL ? 'لم يتم العثور على الطلب المطلوب' : 'The requested order could not be found'}
            </p>
            <Button onClick={() => navigate('/admin/orders')}>
              {isRTL ? 'العودة للطلبات' : 'Back to Orders'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; color: string }> = {
      pending: {
        variant: 'outline',
        label: isRTL ? 'في الانتظار' : 'Pending',
        color: 'text-orange-600'
      },
      processing: {
        variant: 'secondary',
        label: isRTL ? 'قيد المعالجة' : 'Processing',
        color: 'text-blue-600'
      },
      shipped: {
        variant: 'default',
        label: isRTL ? 'تم الشحن' : 'Shipped',
        color: 'text-purple-600'
      },
      delivered: {
        variant: 'default',
        label: isRTL ? 'تم التسليم' : 'Delivered',
        color: 'text-green-600'
      },
      cancelled: {
        variant: 'destructive',
        label: isRTL ? 'ملغي' : 'Cancelled',
        color: 'text-red-600'
      },
      refunded: {
        variant: 'destructive',
        label: isRTL ? 'مسترد' : 'Refunded',
        color: 'text-red-600'
      }
    };

    const config = statusConfig[status] || { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    
    return (
      <div className="flex items-center gap-2">
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

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;
    
    setIsLoading(true);
    try {
      const success = await updateOrderStatus(order.id, newStatus as Order['status']);
      if (success) {
        toast({
          title: isRTL ? 'تم تحديث حالة الطلب' : 'Order Status Updated',
          description: isRTL ? 'تم تحديث حالة الطلب بنجاح' : 'Order status has been updated successfully',
        });
        setIsEditingStatus(false);
        setNewStatus('');
        // Refresh the page to get updated data
        window.location.reload();
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
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsLoading(true);
    try {
      const success = await addOrderNote(order.id, newNote);
      if (success) {
        toast({
          title: isRTL ? 'تم إضافة الملاحظة' : 'Note Added',
          description: isRTL ? 'تم إضافة الملاحظة بنجاح' : 'Note has been added successfully',
        });
        setIsEditingNote(false);
        setNewNote('');
        // Refresh the page to get updated data
        window.location.reload();
      } else {
        throw new Error('Add note failed');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إضافة الملاحظة' : 'Failed to add note',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isRTL ?
      date.toLocaleDateString('ar-KW-u-ca-gregory', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) :
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  {isRTL ? `طلب رقم ${order.orderNumber}` : `Order ${order.orderNumber}`}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? `تم الإنشاء في ${formatDate(order.createdAt)}` : `Created on ${formatDate(order.createdAt)}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                {isRTL ? 'طباعة' : 'Print'}
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                {isRTL ? 'اتصال' : 'Contact'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {isRTL ? 'حالة الطلب' : 'Order Status'}
                  </CardTitle>
                  {!isEditingStatus && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsEditingStatus(true);
                        setNewStatus(order.status);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingStatus ? (
                  <div className="space-y-4">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                        <SelectItem value="processing">{isRTL ? 'قيد المعالجة' : 'Processing'}</SelectItem>
                        {!order.isDigitalOnly && (
                          <SelectItem value="shipped">{isRTL ? 'مشحون' : 'Shipped'}</SelectItem>
                        )}
                        <SelectItem value="delivered">{isRTL ? 'مكتمل' : 'Delivered'}</SelectItem>
                        <SelectItem value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button onClick={handleStatusUpdate} disabled={isLoading} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        {isRTL ? 'حفظ' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingStatus(false);
                          setNewStatus('');
                        }} 
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getStatusBadge(order.status, order.paymentStatus)}
                    {order.deliveredAt && (
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? `تم التسليم في: ${formatDate(order.deliveredAt)}` : `Delivered on: ${formatDate(order.deliveredAt)}`}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'عناصر الطلب' : 'Order Items'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {isRTL ? item.title : item.titleEn}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? item.titleEn : item.title}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">
                            {item.category === 'guide' ? (isRTL ? 'دليل رقمي' : 'Digital Guide') :
                             item.category === 'physical' ? (isRTL ? 'منتج فعلي' : 'Physical Product') :
                             (isRTL ? 'استشارة' : 'Consultation')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {isRTL ? 'الكمية:' : 'Qty:'} {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {item.price.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {(item.price * item.quantity).toFixed(2)} {isRTL ? 'د.ك' : 'KWD'} {isRTL ? 'الإجمالي' : 'total'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>{order.subtotal.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}</span>
                  </div>
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? 'الشحن:' : 'Shipping:'}</span>
                      <span>{order.shippingCost.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>
                        {isRTL ? 'خصم' : 'Discount'} 
                        {order.promoCode && ` (${order.promoCode})`}:
                      </span>
                      <span>-{order.discount.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>{isRTL ? 'المجموع الكلي:' : 'Total:'}</span>
                    <span>{order.total.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{isRTL ? 'ملاحظات الطلب' : 'Order Notes'}</CardTitle>
                  {!isEditingNote && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsEditingNote(true);
                        setNewNote(order.notes || '');
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNote ? (
                  <div className="space-y-4">
                    <Label htmlFor="orderNote">
                      {isRTL ? 'ملاحظة جديدة' : 'Order Note'}
                    </Label>
                    <Textarea
                      id="orderNote"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder={isRTL ? 'أضف ملاحظة على الطلب...' : 'Add a note about this order...'}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddNote} disabled={isLoading} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        {isRTL ? 'حفظ' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingNote(false);
                          setNewNote('');
                        }} 
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {order.notes ? (
                      <p className="text-sm bg-muted p-3 rounded-lg" dir={isRTL ? 'rtl' : 'ltr'}>
                        {order.notes}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {isRTL ? 'لا توجد ملاحظات على هذا الطلب' : 'No notes for this order'}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {isRTL ? 'معلومات العميل' : 'Customer Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {order.customer.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {order.customer.phone}
                    </p>
                  </div>
                  {order.customer.robloxUsername && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        Roblox: {order.customer.robloxUsername}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            {order.shipping && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {isRTL ? 'معلومات الشحن' : 'Shipping Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{order.shipping.address}</p>
                    <p>{order.shipping.city}, {order.shipping.area}</p>
                    {order.shipping.building && (
                      <p>{isRTL ? 'مبنى:' : 'Building:'} {order.shipping.building}</p>
                    )}
                    {order.shipping.floor && (
                      <p>{isRTL ? 'طابق:' : 'Floor:'} {order.shipping.floor}</p>
                    )}
                    {order.shipping.apartment && (
                      <p>{isRTL ? 'شقة:' : 'Apartment:'} {order.shipping.apartment}</p>
                    )}
                    {order.shipping.notes && (
                      <div className="mt-3">
                        <p className="font-medium text-xs text-muted-foreground mb-1">
                          {isRTL ? 'ملاحظات الشحن:' : 'Delivery Notes:'}
                        </p>
                        <p className="bg-muted p-2 rounded text-xs" dir={isRTL ? 'rtl' : 'ltr'}>
                          {order.shipping.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {isRTL ? 'معلومات الدفع' : 'Payment Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'طريقة الدفع:' : 'Payment Method:'}
                  </span>
                  <Badge variant="outline">
                    {order.paymentMethod.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'حالة الدفع:' : 'Payment Status:'}
                  </span>
                  <Badge variant={
                    order.paymentStatus === 'paid' ? 'default' : 
                    order.paymentStatus === 'pending' ? 'secondary' : 
                    'destructive'
                  }>
                    {order.paymentStatus === 'paid' ? (isRTL ? 'مدفوع' : 'Paid') :
                     order.paymentStatus === 'pending' ? (isRTL ? 'معلق' : 'Pending') :
                     order.paymentStatus === 'failed' ? (isRTL ? 'فاشل' : 'Failed') :
                     order.paymentStatus === 'refunded' ? (isRTL ? 'مسترد' : 'Refunded') :
                     order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {isRTL ? 'المبلغ المدفوع:' : 'Amount Paid:'}
                  </span>
                  <span className="font-medium">
                    {order.total.toFixed(2)} {isRTL ? 'د.ك' : 'KWD'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {isRTL ? 'جدول الطلب الزمني' : 'Order Timeline'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{isRTL ? 'تم إنشاء الطلب' : 'Order Created'}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{isRTL ? 'تم تحديث الطلب' : 'Order Updated'}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {order.deliveredAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">{isRTL ? 'تم التسليم' : 'Delivered'}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(order.deliveredAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderView;