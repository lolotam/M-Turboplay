import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Loader2,
  Palette,
  MoveUp,
  MoveDown,
  FolderOpen,
  Folder
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminNavHeader from '@/components/admin/AdminNavHeader';

interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  color: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

const AdminCategories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    color: '#6B7280',
    icon: '',
    parentId: '',
    sortOrder: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for now - in production, this would come from Supabase
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'بلايستيشن',
          nameEn: 'PlayStation',
          slug: 'playstation',
          description: 'ألعاب بلايستيشن الحديثة والكلاسيكية',
          descriptionEn: 'Modern and classic PlayStation games',
          color: '#006FCD',
          icon: 'playstation',
          sortOrder: 1,
          isActive: true,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          children: [
            {
              id: '1-1',
              name: 'ألعاب PS5',
              nameEn: 'PS5 Games',
              slug: 'ps5-games',
              description: 'ألعاب بلايستيشن 5',
              descriptionEn: 'PlayStation 5 games',
              color: '#006FCD',
              sortOrder: 1,
              isActive: true,
              parentId: '1',
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
            }
          ]
        },
        {
          id: '2',
          name: 'إكس بوكس',
          nameEn: 'Xbox',
          slug: 'xbox',
          description: 'ألعاب إكس بوكس بجميع إصداراتها',
          descriptionEn: 'Xbox games across all generations',
          color: '#107C10',
          icon: 'xbox',
          sortOrder: 2,
          isActive: true,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
        {
          id: '3',
          name: 'ألعاب الأكشن',
          nameEn: 'Action Games',
          slug: 'action',
          description: 'ألعاب الأكشن والمغامرات السريعة',
          descriptionEn: 'Fast-paced action and adventure games',
          color: '#FF6B35',
          icon: 'action',
          sortOrder: 6,
          isActive: true,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        }
      ];

      setCategories(mockCategories);
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل الفئات' : 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = isRTL ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = isRTL ? 'الاسم بالإنجليزية مطلوب' : 'English name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = isRTL ? 'الرابط مطلوب' : 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = isRTL ? 'الرابط يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط' : 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      color: '#6B7280',
      icon: '',
      parentId: '',
      sortOrder: 0,
      isActive: true,
    });
    setErrors({});
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategory: Category = {
          ...editingCategory,
          name: formData.name,
          nameEn: formData.nameEn,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          color: formData.color,
          icon: formData.icon,
          parentId: formData.parentId || undefined,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
          updatedAt: new Date().toISOString(),
        };

        setCategories(prev => prev.map(cat =>
          cat.id === editingCategory.id ? updatedCategory : cat
        ));

        toast({
          title: isRTL ? 'تم تحديث الفئة' : 'Category Updated',
          description: isRTL ? 'تم تحديث الفئة بنجاح' : 'Category has been updated successfully',
        });
      } else {
        // Create new category
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formData.name,
          nameEn: formData.nameEn,
          slug: formData.slug,
          description: formData.description,
          descriptionEn: formData.descriptionEn,
          color: formData.color,
          icon: formData.icon,
          parentId: formData.parentId === 'main-category' ? undefined : formData.parentId || undefined,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCategories(prev => [...prev, newCategory]);

        toast({
          title: isRTL ? 'تم إنشاء الفئة' : 'Category Created',
          description: isRTL ? 'تم إنشاء الفئة بنجاح' : 'Category has been created successfully',
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ الفئة' : 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn,
      slug: category.slug,
      description: category.description || '',
      descriptionEn: category.descriptionEn || '',
      color: category.color,
      icon: category.icon || '',
      parentId: category.parentId || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast({
        title: isRTL ? 'تم حذف الفئة' : 'Category Deleted',
        description: isRTL ? 'تم حذف الفئة بنجاح' : 'Category has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف الفئة' : 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string, field: 'name' | 'nameEn') => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !prev.slug ? { slug: generateSlug(value) } : {})
    }));
  };

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    setCategories(prev => {
      const categoriesCopy = [...prev];
      const index = categoriesCopy.findIndex(cat => cat.id === categoryId);

      if (
        (direction === 'up' && index > 0) ||
        (direction === 'down' && index < categoriesCopy.length - 1)
      ) {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [categoriesCopy[index], categoriesCopy[targetIndex]] = [categoriesCopy[targetIndex], categoriesCopy[index]];
      }

      return categoriesCopy;
    });
  };

  const availableParentCategories = categories.filter(cat =>
    !cat.parentId && cat.id !== editingCategory?.id
  );

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
                {isRTL ? 'إدارة الفئات' : 'Category Management'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إدارة فئات المنتجات والتصنيفات' : 'Manage product categories and classifications'}
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إضافة فئة جديدة' : 'Add New Category'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? (isRTL ? 'تعديل الفئة' : 'Edit Category') : (isRTL ? 'إضافة فئة جديدة' : 'Add New Category')}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      {isRTL ? 'الاسم (العربية)' : 'Name (Arabic)'} *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value, 'name')}
                      placeholder={isRTL ? 'أدخل الاسم باللغة العربية' : 'Enter name in Arabic'}
                      className={errors.name ? 'border-destructive' : ''}
                      dir="rtl"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="nameEn">
                      {isRTL ? 'الاسم (الإنجليزية)' : 'Name (English)'} *
                    </Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => handleNameChange(e.target.value, 'nameEn')}
                      placeholder={isRTL ? 'أدخل الاسم باللغة الإنجليزية' : 'Enter name in English'}
                      className={errors.nameEn ? 'border-destructive' : ''}
                      dir="ltr"
                    />
                    {errors.nameEn && <p className="text-xs text-destructive mt-1">{errors.nameEn}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">
                    {isRTL ? 'الرابط (Slug)' : 'Slug'} *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="category-slug"
                    className={errors.slug ? 'border-destructive' : ''}
                    dir="ltr"
                  />
                  {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">
                      {isRTL ? 'الوصف (العربية)' : 'Description (Arabic)'}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={isRTL ? 'أدخل وصف الفئة باللغة العربية' : 'Enter category description in Arabic'}
                      dir="rtl"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="descriptionEn">
                      {isRTL ? 'الوصف (الإنجليزية)' : 'Description (English)'}
                    </Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      placeholder={isRTL ? 'أدخل وصف الفئة باللغة الإنجليزية' : 'Enter category description in English'}
                      dir="ltr"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="color">
                      {isRTL ? 'اللون' : 'Color'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#6B7280"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="icon">
                      {isRTL ? 'الأيقونة' : 'Icon'}
                    </Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="icon-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parentId">
                      {isRTL ? 'الفئة الأم' : 'Parent Category'}
                    </Label>
                    <Select
                      value={formData.parentId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر الفئة الأم' : 'Select parent category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-category">{isRTL ? 'فئة رئيسية' : 'Main Category'}</SelectItem>
                        {availableParentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {isRTL ? category.name : category.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortOrder">
                      {isRTL ? 'ترتيب العرض' : 'Sort Order'}
                    </Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      min="0"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">
                      {isRTL ? 'فئة نشطة' : 'Active Category'}
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingCategory ? (isRTL ? 'تحديث' : 'Update') : (isRTL ? 'إنشاء' : 'Create')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'جميع الفئات' : 'All Categories'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="mr-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا توجد فئات حالياً' : 'No categories found'}
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          {category.children && category.children.length > 0 ? (
                            expandedCategories.has(category.id) ? (
                              <FolderOpen className="w-4 h-4" />
                            ) : (
                              <Folder className="w-4 h-4" />
                            )
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </Button>

                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {isRTL ? category.name : category.nameEn}
                            </h3>
                            <Badge
                              variant={category.isActive ? 'default' : 'secondary'}
                              style={{
                                backgroundColor: category.isActive ? category.color : undefined,
                                color: category.isActive ? 'white' : undefined
                              }}
                            >
                              {category.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {category.slug} • {isRTL ? 'ترتيب:' : 'Order:'} {category.sortOrder}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveCategory(category.id, 'up')}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveCategory(category.id, 'down')}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {isRTL ? 'حذف الفئة' : 'Delete Category'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {isRTL
                                  ? `هل أنت متأكد من حذف الفئة "${isRTL ? category.name : category.nameEn}"؟ لا يمكن التراجع عن هذا الإجراء.`
                                  : `Are you sure you want to delete the category "${isRTL ? category.name : category.nameEn}"? This action cannot be undone.`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {isRTL ? 'إلغاء' : 'Cancel'}
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                {isRTL ? 'حذف' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Children Categories */}
                    {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
                      <div className="mt-4 ml-8 space-y-2 border-l-2 border-muted pl-4">
                        {category.children.map((child) => (
                          <div key={child.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: child.color }}
                              />
                              <span className="text-sm">
                                {isRTL ? child.name : child.nameEn}
                              </span>
                              <Badge variant={child.isActive ? 'default' : 'secondary'}>
                                {child.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(child)}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {isRTL ? 'حذف الفئة الفرعية' : 'Delete Subcategory'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {isRTL
                                        ? `هل أنت متأكد من حذف الفئة الفرعية "${isRTL ? child.name : child.nameEn}"؟`
                                        : `Are you sure you want to delete the subcategory "${isRTL ? child.name : child.nameEn}"?`
                                      }
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {isRTL ? 'إلغاء' : 'Cancel'}
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(child.id)}>
                                      {isRTL ? 'حذف' : 'Delete'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCategories;