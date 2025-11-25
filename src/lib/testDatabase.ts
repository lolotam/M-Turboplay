import { supabase } from './supabase';

export const testDatabaseConnection = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized. Check environment variables.');
    return false;
  }

  try {
    // Test connection by fetching from a simple table
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
};