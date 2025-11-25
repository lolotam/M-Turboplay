import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Save, X, GripVertical } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface Section {
  id: string;
  title: string;
  titleEn: string;
  subtitle?: string;
  subtitleEn?: string;
  color: string;
  products?: any[];
  isActive: boolean;
}

const DynamicSectionsManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'حسابات روبلوكس',
      titleEn: 'ROBLOX ACCOUNTS',
      subtitle: 'حسابات جاهزة للعب',
      subtitleEn: 'Ready to play accounts',
      color: 'from-blue-500 to-cyan-500',
      isActive: true
    },
    {
      id: '2',
      title: 'ماب بلوكس فروت',
      titleEn: 'BLOX FRUITS',
      subtitle: 'أفضل الفواكه',
      subtitleEn: 'Best fruits game',
      color: 'from-orange-500 to-red-500',
      isActive: true
    },
    {
      id: '3',
      title: 'ماب المزرعة',
      titleEn: 'GROW A GARDEN',
      subtitle: 'ازرع مزرعتك',
      subtitleEn: 'Grow your farm',
      color: 'from-green-500 to-emerald-500',
      isActive: true
    }
  ]);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ title: '', titleEn: '', subtitle: '', subtitleEn: '' });

  const handleAddSection = () => {
    if (newSection.title.trim() && newSection.titleEn.trim()) {
      const section: Section = {
        id: Date.now().toString(),
        title: newSection.title,
        titleEn: newSection.titleEn,
        subtitle: newSection.subtitle,
        subtitleEn: newSection.subtitleEn,
        color: `from-purple-500 to-pink-500`,
        isActive: true
      };
      
      setSections([...sections, section]);
      setNewSection({ title: '', titleEn: '', subtitle: '', subtitleEn: '' });
      setIsAddingSection(false);
    }
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleToggleSection = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isActive: !section.isActive } : section
    ));
  };

  const handleEditSection = (id: string, field: keyof Section, value: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const startEditing = (id: string) => {
    setEditingSection(id);
  };

  const saveEdit = (id: string) => {
    setEditingSection(null);
  };

  return (
    <div className="py-12 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gradient mb-4">
            {isRTL ? 'إدارة الأقسام' : 'Sections Management'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL ? 'أضف وأدر أقسام الموقع بشكل ديناميكي' : 'Add and manage website sections dynamically'}
          </p>
        </div>

        {/* Add New Section Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setIsAddingSection(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة قسم جديد' : 'Add New Section'}
          </Button>
        </div>

        {/* Add New Section Form */}
        {isAddingSection && (
          <Card className="mb-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-200">
                {isRTL ? 'إضافة قسم جديد' : 'Add New Section'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {isRTL ? 'اسم القسم (عربي)' : 'Section Name (Arabic)'}
                  </label>
                  <Input
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder={isRTL ? 'أدخل اسم القسم' : 'Enter section name'}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {isRTL ? 'اسم القسم (إنجليزي)' : 'Section Name (English)'}
                  </label>
                  <Input
                    value={newSection.titleEn}
                    onChange={(e) => setNewSection({ ...newSection, titleEn: e.target.value })}
                    placeholder={isRTL ? 'أدخل اسم القسم بالإنجليزي' : 'Enter section name in English'}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {isRTL ? 'وصف قصير (عربي)' : 'Short Description (Arabic)'}
                  </label>
                  <Input
                    value={newSection.subtitle}
                    onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                    placeholder={isRTL ? 'وصف اختياري' : 'Optional description'}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    {isRTL ? 'وصف قصير (إنجليزي)' : 'Short Description (English)'}
                  </label>
                  <Input
                    value={newSection.subtitleEn}
                    onChange={(e) => setNewSection({ ...newSection, subtitleEn: e.target.value })}
                    placeholder={isRTL ? 'وصف اختياري بالإنجليزي' : 'Optional description in English'}
                    className="bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-400"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingSection(false);
                    setNewSection({ title: '', titleEn: '', subtitle: '', subtitleEn: '' });
                  }}
                  className="border-purple-500/30 text-purple-300 hover:border-purple-500/60"
                >
                  <X className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleAddSection}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Card
              key={section.id}
              className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                section.isActive ? 'ring-2 ring-purple-500/50' : 'opacity-75'
              }`}
              style={{
                background: `linear-gradient(145deg, #1A1A2E 0%, #2D1B4E 100%)`,
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              {/* Section Header */}
              <div className={`h-2 bg-gradient-to-r ${section.color}`} />
              
              <CardContent className="p-6">
                {/* Edit Mode */}
                {editingSection === section.id ? (
                  <div className="space-y-3">
                    <Input
                      value={section.title}
                      onChange={(e) => handleEditSection(section.id, 'title', e.target.value)}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 mb-2"
                    />
                    <Input
                      value={section.titleEn}
                      onChange={(e) => handleEditSection(section.id, 'titleEn', e.target.value)}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 mb-2"
                    />
                    <Input
                      value={section.subtitle || ''}
                      onChange={(e) => handleEditSection(section.id, 'subtitle', e.target.value)}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 mb-2"
                    />
                    <Input
                      value={section.subtitleEn || ''}
                      onChange={(e) => handleEditSection(section.id, 'subtitleEn', e.target.value)}
                      className="bg-purple-950/50 border-purple-500/30 text-purple-100 mb-3"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(section.id)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSection(null)}
                        className="border-purple-500/30 text-purple-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {isRTL ? section.title : section.titleEn}
                        </h3>
                        <p className="text-sm text-purple-200 italic">
                          {isRTL ? section.subtitle : section.subtitleEn}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(section.id)}
                          className="border-purple-500/30 text-purple-300 hover:border-purple-500/60"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSection(section.id)}
                          className="border-red-500/30 text-red-300 hover:border-red-500/60"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge
                        className={`px-3 py-1 cursor-pointer ${
                          section.isActive
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}
                        onClick={() => handleToggleSection(section.id)}
                      >
                        {section.isActive
                          ? (isRTL ? 'نشط' : 'Active')
                          : (isRTL ? 'غير نشط' : 'Inactive')
                        }
                      </Badge>
                      <GripVertical className="w-4 h-4 text-purple-400" />
                    </div>

                    {/* Products Preview */}
                    <div className="bg-purple-950/30 rounded-lg p-4">
                      <p className="text-sm text-purple-200 mb-2">
                        {isRTL ? 'المنتجات:' : 'Products:'}
                      </p>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="bg-purple-900/50 rounded p-2 border border-purple-500/20"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded" />
                              <div className="flex-1">
                                <div className="h-2 bg-purple-700 rounded mb-1" />
                                <div className="h-2 bg-purple-600 rounded w-3/4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2 text-gradient">
              {isRTL ? 'لا توجد أقسام' : 'No Sections Yet'}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? 'ابدأ بإضافة أول قسم لك' : 'Start by adding your first section'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSectionsManager;