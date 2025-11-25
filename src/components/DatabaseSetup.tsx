import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { productService } from '@/services/database';
import { useProducts } from '@/contexts/ProductsContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    title: 'دليل الحيوانات الشامل',
    titleEn: 'Complete Pets Guide',
    description: 'دليل شامل لجميع الحيوانات في Grow a Garden مع أفضل الاستراتيجيات والنصائح',
    descriptionEn: 'Complete guide for all pets in Grow a Garden with best strategies and tips',
    price: 3.50,
    originalPrice: 5.00,
    image: '/src/assets/pets-guide-cover.jpg',
    category: 'guide' as const,
    isNew: true,
    isDigital: true,
    stock: 999,
    sku: 'PG-001',
    tags: ['pets', 'guide', 'strategy'],
    status: 'active' as const,
  },
  {
    title: 'تيشيرت Queen Bee',
    titleEn: 'Queen Bee T-Shirt',
    description: 'تيشيرت مريح بتصميم ملكة النحل من لعبة Grow a Garden',
    descriptionEn: 'Comfortable t-shirt with Queen Bee design from Grow a Garden',
    price: 12.75,
    image: '/src/assets/queen-bee-tshirt.jpg',
    category: 'physical' as const,
    isDigital: false,
    stock: 25,
    sku: 'TS-QB-001',
    tags: ['clothing', 'queen bee', 'merchandise'],
    status: 'active' as const,
  },
  {
    title: 'جلسة إرشادية شخصية',
    titleEn: 'Personal Consultation Session',
    description: 'جلسة إرشادية مدتها 30 دقيقة لتحسين استراتيجيتك في اللعبة',
    descriptionEn: '30-minute consultation session to improve your game strategy',
    price: 18.00,
    image: '/src/assets/consultation-session.jpg',
    category: 'consultation' as const,
    isLimited: true,
    isDigital: true,
    stock: 10,
    sku: 'CS-001',
    tags: ['consultation', 'strategy', 'personal'],
    status: 'active' as const,
  },
  {
    title: 'خارطة الفعاليات الحالية',
    titleEn: 'Current Events Map',
    description: 'خارطة شاملة للفعاليات الحالية: Fairy Event و Crystal Beams',
    descriptionEn: 'Comprehensive map for current events: Fairy Event and Crystal Beams',
    price: 2.25,
    originalPrice: 3.50,
    image: '/src/assets/events-map.jpg',
    category: 'guide' as const,
    isDigital: true,
    stock: 999,
    sku: 'EM-001',
    tags: ['events', 'map', 'fairy', 'crystal'],
    status: 'active' as const,
  },
  {
    title: 'ملصقات حيوانات المزرعة',
    titleEn: 'Farm Animals Sticker Pack',
    description: 'مجموعة ملصقات عالية الجودة لحيوانات Grow a Garden المفضلة لديك',
    descriptionEn: 'High-quality sticker pack of your favorite Grow a Garden farm animals',
    price: 4.50,
    image: '/src/assets/sticker-pack.jpg',
    category: 'physical' as const,
    isNew: true,
    isDigital: false,
    stock: 50,
    sku: 'SP-FA-001',
    tags: ['stickers', 'farm animals', 'collectible'],
    status: 'active' as const,
  },
  {
    title: 'دليل بناء المزرعة المثالية',
    titleEn: 'Perfect Farm Building Guide',
    description: 'تعلم كيفية تصميم وبناء المزرعة المثالية مع أفضل التخطيطات',
    descriptionEn: 'Learn how to design and build the perfect farm with optimal layouts',
    price: 4.00,
    image: '/src/assets/farm-guide.jpg',
    category: 'guide' as const,
    isDigital: true,
    stock: 999,
    sku: 'FG-001',
    tags: ['farming', 'building', 'layout', 'optimization'],
    status: 'active' as const,
  },
  {
    title: 'كاب Golden Chicken',
    titleEn: 'Golden Chicken Cap',
    description: 'كاب أنيق مع تطريز Golden Chicken من اللعبة',
    descriptionEn: 'Stylish cap with Golden Chicken embroidery from the game',
    price: 8.99,
    originalPrice: 10.50,
    image: '/src/assets/golden-chicken-cap.jpg',
    category: 'physical' as const,
    isNew: true,
    isDigital: false,
    stock: 30,
    sku: 'CAP-GC-001',
    tags: ['cap', 'golden chicken', 'accessories'],
    status: 'active' as const,
  },
  {
    title: 'دليل استراتيجيات التداول',
    titleEn: 'Trading Strategies Guide',
    description: 'دليل متقدم لتحقيق أفضل الصفقات في سوق اللعبة',
    descriptionEn: 'Advanced guide for making the best deals in the game market',
    price: 5.75,
    image: '/src/assets/trading-guide.jpg',
    category: 'guide' as const,
    isLimited: true,
    isDigital: true,
    stock: 999,
    sku: 'TG-001',
    tags: ['trading', 'economy', 'strategy'],
    status: 'active' as const,
  },
  {
    title: 'مج Crystal Beams',
    titleEn: 'Crystal Beams Mug',
    description: 'مج سيراميك مع تصميم Crystal Beams الرائع',
    descriptionEn: 'Ceramic mug with awesome Crystal Beams design',
    price: 6.50,
    image: '/src/assets/crystal-mug.jpg',
    category: 'physical' as const,
    isDigital: false,
    stock: 40,
    sku: 'MUG-CB-001',
    tags: ['mug', 'crystal beams', 'drinkware'],
    status: 'active' as const,
  },
  {
    title: 'حزمة الأدلة الكاملة',
    titleEn: 'Complete Guide Bundle',
    description: 'احصل على جميع الأدلة في حزمة واحدة بسعر مخفض',
    descriptionEn: 'Get all guides in one bundle at a discounted price',
    price: 14.99,
    originalPrice: 20.00,
    image: '/src/assets/bundle-cover.jpg',
    category: 'guide' as const,
    isNew: true,
    isLimited: true,
    isDigital: true,
    stock: 999,
    sku: 'BDL-001',
    tags: ['bundle', 'guides', 'value pack'],
    status: 'active' as const,
  }
];

const DatabaseSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed' | null>(null);
  const { toast } = useToast();
  const { addProduct, refreshProducts } = useProducts();

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('testing');

    try {
      const isConnected = await productService.testConnection();

      if (isConnected) {
        setConnectionStatus('connected');
        toast({
          title: '✅ Database Connected',
          description: 'Successfully connected to Supabase database',
        });
      } else {
        setConnectionStatus('failed');
        toast({
          title: '⚠️ Connection Failed',
          description: 'Could not connect to Supabase. Please check your .env configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: '❌ Error',
        description: 'Failed to test database connection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const insertSampleProducts = async () => {
    setIsLoading(true);
    let successCount = 0;

    try {
      for (const product of SAMPLE_PRODUCTS) {
        const success = await addProduct(product);
        if (success) successCount++;
      }

      await refreshProducts();

      toast({
        title: '✅ Products Added',
        description: `Successfully added ${successCount} out of ${SAMPLE_PRODUCTS.length} products`,
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to add sample products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Database Setup & Testing</CardTitle>
        <CardDescription>
          Configure and test your Supabase database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Setup Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            <li>Go to <a href="https://supabase.com" target="_blank" className="text-primary hover:underline">supabase.com</a> and create a free account</li>
            <li>Create a new project</li>
            <li>Go to Settings → API</li>
            <li>Copy the Project URL and anon key</li>
            <li>Update the .env file with your credentials</li>
            <li>Run the SQL schema in your Supabase SQL editor (supabase_schema.sql)</li>
            <li>Restart the development server</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            disabled={isLoading}
            variant={connectionStatus === 'connected' ? 'default' : 'outline'}
          >
            {isLoading && connectionStatus === 'testing' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : connectionStatus === 'connected' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Connected
              </>
            ) : connectionStatus === 'failed' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Test Again
              </>
            ) : (
              'Test Connection'
            )}
          </Button>

          <Button
            onClick={insertSampleProducts}
            disabled={isLoading || connectionStatus !== 'connected'}
          >
            {isLoading && connectionStatus !== 'testing' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding Products...
              </>
            ) : (
              'Add 10 Sample Products'
            )}
          </Button>
        </div>

        {connectionStatus === 'failed' && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <p className="font-semibold mb-1">Connection failed. Please check:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your .env file has valid Supabase credentials</li>
              <li>The database tables are created (run the SQL schema)</li>
              <li>You've restarted the development server after updating .env</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetup;