'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function getShareUrl(id: string) {
  if (!id) {
    redirect('/');
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('shared_urls')
      .select('long_url, clicks')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching URL:', error);
      redirect('/');
    }

    void supabase
      .from('shared_urls')
      .update({ clicks: (data.clicks || 0) + 1 })
      .eq('id', id);

    return { url: data.long_url };
  } catch (error) {
    console.error('Error in getShareUrl:', error);
    redirect('/');
  }
}
