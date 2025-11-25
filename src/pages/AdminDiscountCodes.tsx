import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus, Percent, DollarSign, Users, User, Ticket, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { exportDiscountCodesToCSV } from '@/lib/csvExport';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit: number;
  usedCount: number;
  oneUserOnly: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminDiscountCodes = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    usageLimit: 1,
    oneUserOnly: false
  });

  // Load discount codes from localStorage
  useEffect(() => {
    const loadDiscountCodes = () => {
      try {
        const savedCodes = localStorage.getItem('admin_discount_codes');
        if (savedCodes) {
          setDiscountCodes(JSON.parse(savedCodes));
        } else {
          // Initialize with existing hardcoded codes
          const initialCodes: DiscountCode[] = [
            {
              id: '1',
              code: 'garden10',
              type: 'percentage',
              value: 10,
              usageLimit: 100,
              usedCount: 15,
              oneUserOnly: false,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              code: 'mohmd',
              type: 'fixed',
              value: 143,
              usageLimit: 1,
              usedCount: 0,
              oneUserOnly: true,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '3',
              code: '10qw',
              type: 'percentage',
              value: 50,
              usageLimit: 50,
              usedCount: 8,
              oneUserOnly: false,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '4',
              code: '100x',
              type: 'percentage',
              value: 75,
              usageLimit: 25,
              usedCount: 3,
              oneUserOnly: false,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '5',
              code: 'محمد12',
              type: 'percentage',
              value: 90,
              usageLimit: 1,
              usedCount: 0,
              oneUserOnly: true,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setDiscountCodes(initialCodes);
          localStorage.setItem('admin_discount_codes', JSON.stringify(initialCodes));
        }
      } catch (error) {
        console.error('Error loading discount codes:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل في تحميل أكواد الخصم' : 'Failed to load discount codes',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscountCodes();
  }, [isRTL, toast]);

  const saveDiscountCodes = (codes: DiscountCode[]) => {
    try {
      localStorage.setItem('admin_discount_codes', JSON.stringify(codes));
      setDiscountCodes(codes);
    } catch (error) {
      console.error('Error saving discount codes:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ أكواد الخصم' : 'Failed to save discount codes',
        variant: 'destructive'
      });
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      usageLimit: 1,
      oneUserOnly: false
    });
    setEditingCode(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال كود الخصم' : 'Please enter discount code',
        variant: 'destructive'
      });
      return;
    }

    if (formData.value <= 0) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى إدخال قيمة خصم صحيحة' : 'Please enter valid discount value',
        variant: 'destructive'
      });
      return;
    }

    if (formData.type === 'percentage' && formData.value > 100) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'نسبة الخصم لا يمكن أن تزيد عن 100%' : 'Percentage discount cannot exceed 100%',
        variant: 'destructive'
      });
      return;
    }

    // Check for duplicate codes (excluding current editing code)
    const existingCode = discountCodes.find(code => 
      code.code.toLowerCase() === formData.code.toLowerCase() && 
      (!editingCode || code.id !== editingCode.id)
    );

    if (existingCode) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'كود الخصم موجود بالفعل' : 'Discount code already exists',
        variant: 'destructive'
      });
      return;
    }

    const now = new Date().toISOString();

    if (editingCode) {
      // Update existing code
      const updatedCodes = discountCodes.map(code =>
        code.id === editingCode.id
          ? {
              ...code,
              ...formData,
              updatedAt: now
            }
          : code
      );
      saveDiscountCodes(updatedCodes);
      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث كود الخصم بنجاح' : 'Discount code updated successfully'
      });
    } else {
      // Add new code
      const newCode: DiscountCode = {
        id: generateId(),
        ...formData,
        usedCount: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };
      saveDiscountCodes([...discountCodes, newCode]);
      toast({
        title: isRTL ? 'تم الإنشاء' : 'Created',
        description: isRTL ? 'تم إنشاء كود الخصم بنجاح' : 'Discount code created successfully'
      });
    }

    resetForm();
  };

  const handleEdit = (code: DiscountCode) => {
    setFormData({
      code: code.code,
      type: code.type,
      value: code.value,
      usageLimit: code.usageLimit,
      oneUserOnly: code.oneUserOnly
    });
    setEditingCode(code);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedCodes = discountCodes.filter(code => code.id !== id);
    saveDiscountCodes(updatedCodes);
    toast({
      title: isRTL ? 'تم الحذف' : 'Deleted',
      description: isRTL ? 'تم حذف كود الخصم بنجاح' : 'Discount code deleted successfully'
    });
  };

  const toggleActive = (id: string) => {
    const updatedCodes = discountCodes.map(code =>
      code.id === id
        ? { ...code, isActive: !code.isActive, updatedAt: new Date().toISOString() }
        : code
    );
    saveDiscountCodes(updatedCodes);
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
                <Ticket className="w-6 h-6" />
                {isRTL ? 'إدارة أكواد الخصم' : 'Discount Codes Management'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إنشاء وإدارة أكواد الخصم للمتجر' : 'Create and manage store discount codes'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => exportDiscountCodesToCSV(discountCodes, isRTL)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'تصدير CSV' : 'Export CSV'}
              </Button>
              <Button
                onClick={() => setShowAddForm(true)}
                className="btn-hero"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة كود خصم' : 'Add Discount Code'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingCode 
                  ? (isRTL ? 'تعديل كود الخصم' : 'Edit Discount Code')
                  : (isRTL ? 'إضافة كود خصم جديد' : 'Add New Discount Code')
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Barcode/Code */}
                  <div className="space-y-2">
                    <Label htmlFor="code">
                      {isRTL ? 'كود الخصم' : 'Discount Code'}
                    </Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder={isRTL ? 'أدخل كود الخصم' : 'Enter discount code'}
                      required
                    />
                  </div>

                  {/* Discount Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      {isRTL ? 'نوع الخصم' : 'Discount Type'}
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'percentage' | 'fixed') => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4" />
                            {isRTL ? '% (نسبة مئوية)' : '% (Percentage)'}
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {isRTL ? 'مبلغ ثابت' : 'Fixed Amount'}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Discount Value */}
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      {formData.type === 'percentage' 
                        ? (isRTL ? 'نسبة الخصم (%)' : 'Discount Percentage (%)')
                        : (isRTL ? 'مبلغ الخصم (د.ك)' : 'Discount Amount (KWD)')
                      }
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      max={formData.type === 'percentage' ? 100 : undefined}
                      step={formData.type === 'percentage' ? 1 : 0.001}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                      placeholder={formData.type === 'percentage' ? '10' : '5.000'}
                      required
                    />
                  </div>

                  {/* Usage Limit */}
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">
                      {isRTL ? 'حد الاستخدام' : 'Usage Limit'}
                    </Label>
                    <Select
                      value={formData.usageLimit.toString()}
                      onValueChange={(value) => 
                        setFormData({ ...formData, usageLimit: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 {isRTL ? 'مرة' : 'time'}</SelectItem>
                        <SelectItem value="2">2 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="3">3 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="4">4 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="5">5 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="6">6 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="10">10 {isRTL ? 'مرات' : 'times'}</SelectItem>
                        <SelectItem value="25">25 {isRTL ? 'مرة' : 'times'}</SelectItem>
                        <SelectItem value="50">50 {isRTL ? 'مرة' : 'times'}</SelectItem>
                        <SelectItem value="100">100 {isRTL ? 'مرة' : 'times'}</SelectItem>
                        <SelectItem value="999">
                          {isRTL ? 'غير محدود' : 'Unlimited'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* User Restriction */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneUserOnly"
                    checked={formData.oneUserOnly}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, oneUserOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="oneUserOnly" className="text-sm">
                    {isRTL ? 'مستخدم واحد فقط' : 'One user only'}
                  </Label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingCode 
                      ? (isRTL ? 'تحديث' : 'Update')
                      : (isRTL ? 'إنشاء' : 'Create')
                    }
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Discount Codes Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'أكواد الخصم الحالية' : 'Current Discount Codes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  {isRTL ? 'جاري التحميل...' : 'Loading...'}
                </p>
              </div>
            ) : discountCodes.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد أكواد خصم' : 'No discount codes found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">#</TableHead>
                      <TableHead>{isRTL ? 'الكود' : 'Code'}</TableHead>
                      <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{isRTL ? 'القيمة' : 'Value'}</TableHead>
                      <TableHead>{isRTL ? 'الاستخدام' : 'Usage'}</TableHead>
                      <TableHead>{isRTL ? 'القيود' : 'Restrictions'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountCodes.map((code, index) => (
                      <TableRow key={code.id}>
                        <TableCell className="text-center font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {code.code}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {code.type === 'percentage' ? (
                              <>
                                <Percent className="w-3 h-3" />
                                {isRTL ? 'نسبة' : 'Percentage'}
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3 h-3" />
                                {isRTL ? 'ثابت' : 'Fixed'}
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {code.type === 'percentage' 
                            ? `${code.value}%`
                            : `${code.value.toFixed(3)} د.ك`
                          }
                        </TableCell>
                        <TableCell>
                          <span className={code.usedCount >= code.usageLimit ? 'text-destructive' : ''}>
                            {code.usedCount} / {code.usageLimit === 999 ? '∞' : code.usageLimit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            {code.oneUserOnly ? (
                              <>
                                <User className="w-3 h-3" />
                                {isRTL ? 'مستخدم واحد' : 'One user'}
                              </>
                            ) : (
                              <>
                                <Users className="w-3 h-3" />
                                {isRTL ? 'متعدد المستخدمين' : 'Multiple users'}
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={code.isActive ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => toggleActive(code.id)}
                          >
                            {code.isActive 
                              ? (isRTL ? 'نشط' : 'Active')
                              : (isRTL ? 'غير نشط' : 'Inactive')
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(code)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(code.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDiscountCodes;
