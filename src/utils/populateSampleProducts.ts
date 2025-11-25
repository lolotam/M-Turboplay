import { generateSampleProducts, generateCSVFromProducts } from './generateSampleProducts';
import { supabase } from '@/integrations/supabase/client';

export const populateSampleProducts = async () => {
  try {
    console.log('🎮 Generating 100 sample products for M-TurboPlay...');

    // Generate sample products
    const products = generateSampleProducts();
    console.log(`✅ Generated ${products.length} sample products`);

    // Convert to database format
    const dbProducts = products.map(product => ({
      title: product.title,
      title_en: product.titleEn,
      description: product.description,
      description_en: product.descriptionEn,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory,
      sku: product.sku,
      stock: product.stock,
      is_new: product.isNew,
      is_limited: product.isLimited,
      status: product.status,
      tags: product.tags.split(','),
      images: product.images.split(','),
      image: product.images.split(',')[0],
      is_digital: product.isDigital,
      weight: product.weight,
      dimensions: product.dimensions,
      release_date: product.releaseDate,
      compatibility: product.compatibility,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log('💾 Inserting products into database...');

    // Insert products in batches of 10 to avoid overwhelming the database
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('products')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)`);
        successCount += batch.length;
      }
    }

    console.log(`🎉 Sample products population completed!`);
    console.log(`   ✅ Successfully inserted: ${successCount} products`);
    console.log(`   ❌ Failed to insert: ${errorCount} products`);
    console.log(`   📊 Total: ${successCount + errorCount} products processed`);

    return { success: successCount, errors: errorCount, total: products.length };

  } catch (error) {
    console.error('💥 Error populating sample products:', error);
    throw error;
  }
};

export const generateProductsCSV = (): string => {
  console.log('📄 Generating CSV file with 100 sample products...');

  const products = generateSampleProducts();
  const csvContent = generateCSVFromProducts(products);

  console.log(`✅ Generated CSV with ${products.length} products`);
  console.log('💡 Copy and paste the CSV content below to import into your admin panel');

  return csvContent;
};

// Console utility function
export const populateFromConsole = async () => {
  if (typeof window !== 'undefined') {
    console.log('🚀 Starting sample products population...');
    console.log('⏳ This may take a few moments...');

    try {
      const result = await populateSampleProducts();
      console.log('🎉 Population completed!', result);
      return result;
    } catch (error) {
      console.error('💥 Population failed:', error);
      throw error;
    }
  } else {
    console.log('This function should be called from the browser console');
    console.log('Open http://localhost:5555/admin/products and run:');
    console.log('import { populateFromConsole } from "/src/utils/populateSampleProducts.ts"; populateFromConsole();');
  }
};