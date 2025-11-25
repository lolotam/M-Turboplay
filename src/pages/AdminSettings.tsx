import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Key,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import AdminNavHeader from '@/components/admin/AdminNavHeader';
import { useSettings, LLMProvider, AVAILABLE_MODELS } from '@/contexts/SettingsContext';

const AdminSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();
  const { settings, updateSettings, updateProviderConfig, resetSettings, testConnection, saveSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState<Record<LLMProvider, boolean>>({
    openai: false,
    claude: false,
    perplexity: false,
    local: false,
  });
  const [testingProvider, setTestingProvider] = useState<LLMProvider | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<LLMProvider, { tested: boolean; success: boolean; message: string }>>({
    openai: { tested: false, success: false, message: '' },
    claude: { tested: false, success: false, message: '' },
    perplexity: { tested: false, success: false, message: '' },
    local: { tested: true, success: true, message: 'Local AI is always available' },
  });

  const handleSaveSettings = () => {
    saveSettings();
    toast({
      title: isRTL ? '✅ تم الحفظ' : '✅ Saved',
      description: isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully',
    });
  };

  const handleResetSettings = () => {
    if (confirm(isRTL ? 'هل أنت متأكد من إعادة تعيين جميع الإعدادات؟' : 'Are you sure you want to reset all settings?')) {
      resetSettings();
      toast({
        title: isRTL ? '🔄 تم إعادة التعيين' : '🔄 Reset',
        description: isRTL ? 'تم إعادة تعيين الإعدادات إلى القيم الافتراضية' : 'Settings reset to default values',
      });
    }
  };

  const handleTestConnection = async (provider: LLMProvider) => {
    setTestingProvider(provider);
    const result = await testConnection(provider);

    setConnectionStatus(prev => ({
      ...prev,
      [provider]: {
        tested: true,
        success: result.success,
        message: result.message,
      },
    }));

    setTestingProvider(null);

    toast({
      title: result.success ? (isRTL ? '✅ نجح الاتصال' : '✅ Connection Successful') : (isRTL ? '❌ فشل الاتصال' : '❌ Connection Failed'),
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };

  const toggleApiKeyVisibility = (provider: LLMProvider) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const renderProviderCard = (provider: LLMProvider, name: string, description: string, docsUrl: string) => {
    if (provider === 'local') return null;

    const config = settings.providers[provider as keyof typeof settings.providers];
    const status = connectionStatus[provider];

    return (
      <Card key={provider} className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                {name}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {status.tested && (
                <Badge variant={status.success ? 'default' : 'destructive'} className="flex items-center gap-1">
                  {status.success ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {status.success ? (isRTL ? 'متصل' : 'Connected') : (isRTL ? 'غير متصل' : 'Disconnected')}
                </Badge>
              )}
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {isRTL ? 'الوثائق' : 'Docs'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor={`${provider}-api-key`}>
              {isRTL ? 'مفتاح API' : 'API Key'}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id={`${provider}-api-key`}
                  type={showApiKeys[provider] ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => updateProviderConfig(provider, { apiKey: e.target.value })}
                  placeholder={isRTL ? 'أدخل مفتاح API' : 'Enter API key'}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleApiKeyVisibility(provider)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKeys[provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={() => handleTestConnection(provider)}
                disabled={!config.apiKey || testingProvider === provider}
                variant="outline"
              >
                {testingProvider === provider ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isRTL ? 'اختبار' : 'Test'}
              </Button>
            </div>
            {status.tested && !status.success && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {status.message}
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor={`${provider}-model`}>{isRTL ? 'النموذج' : 'Model'}</Label>
            <select
              id={`${provider}-model`}
              value={config.model}
              onChange={(e) => updateProviderConfig(provider, { model: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {AVAILABLE_MODELS[provider as keyof typeof AVAILABLE_MODELS].map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor={`${provider}-temperature`}>
              {isRTL ? 'درجة الحرارة' : 'Temperature'}: {config.temperature}
            </Label>
            <input
              id={`${provider}-temperature`}
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => updateProviderConfig(provider, { temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'قيم أعلى = أكثر إبداعاً، قيم أقل = أكثر تركيزاً' : 'Higher = more creative, Lower = more focused'}
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor={`${provider}-max-tokens`}>{isRTL ? 'الحد الأقصى للرموز' : 'Max Tokens'}</Label>
            <Input
              id={`${provider}-max-tokens`}
              type="number"
              min="1"
              max="4096"
              value={config.maxTokens}
              onChange={(e) => updateProviderConfig(provider, { maxTokens: parseInt(e.target.value) })}
            />
          </div>

          {/* Enable/Disable */}
          <div className="flex items-center gap-2">
            <input
              id={`${provider}-enabled`}
              type="checkbox"
              checked={config.isEnabled}
              onChange={(e) => updateProviderConfig(provider, { isEnabled: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor={`${provider}-enabled`} className="cursor-pointer">
              {isRTL ? 'تفعيل هذا المزود' : 'Enable this provider'}
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            {isRTL ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isRTL ? 'إدارة إعدادات لوحة التحكم وتكوين مزودي الذكاء الاصطناعي' : 'Manage dashboard settings and configure AI providers'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">{isRTL ? 'عام' : 'General'}</TabsTrigger>
            <TabsTrigger value="ai">{isRTL ? 'تكوين الذكاء الاصطناعي' : 'AI Configuration'}</TabsTrigger>
            <TabsTrigger value="integrations">{isRTL ? 'التكاملات' : 'Integrations'}</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الإعدادات العامة' : 'General Settings'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'تكوين التفضيلات الأساسية للوحة التحكم' : 'Configure basic dashboard preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'اللغة' : 'Language'}</Label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSettings({ language: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{isRTL ? 'السمة' : 'Theme'}</Label>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSettings({ theme: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="dark">{isRTL ? 'داكن' : 'Dark'}</option>
                    <option value="light">{isRTL ? 'فاتح' : 'Light'}</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Configuration Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{isRTL ? 'المزود الافتراضي' : 'Default Provider'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'اختر مزود الذكاء الاصطناعي الافتراضي للمساعد' : 'Select the default AI provider for the assistant'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={settings.defaultProvider}
                  onChange={(e) => updateSettings({ defaultProvider: e.target.value as LLMProvider })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="local">{isRTL ? 'محلي (مدمج)' : 'Local (Built-in)'}</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="claude">Anthropic (Claude)</option>
                  <option value="perplexity">Perplexity AI</option>
                </select>
              </CardContent>
            </Card>

            {renderProviderCard('openai', 'OpenAI (ChatGPT)', isRTL ? 'مزود ChatGPT من OpenAI' : 'OpenAI ChatGPT provider', 'https://platform.openai.com/docs/api-reference')}
            {renderProviderCard('claude', 'Anthropic (Claude)', isRTL ? 'مزود Claude من Anthropic' : 'Anthropic Claude provider', 'https://docs.anthropic.com/en/api/getting-started')}
            {renderProviderCard('perplexity', 'Perplexity AI', isRTL ? 'مزود Perplexity AI' : 'Perplexity AI provider', 'https://docs.perplexity.ai/')}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'التكاملات' : 'Integrations'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'قريباً: تكاملات مع خدمات الطرف الثالث' : 'Coming soon: Integrations with third-party services'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد تكاملات متاحة حالياً' : 'No integrations available yet'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
          </Button>
          <Button onClick={handleResetSettings} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

