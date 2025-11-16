'use server';

import { createClient } from '@supabase/supabase-js';

export async function getShareUrl(id: string) {
  if (!id) {
    return null;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;


    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('shared_urls')
      .select('long_url, clicks')
      .eq('id', id)
      .single();


    if (error || !data) {
      return null;
    }

    const { error: updateError } = await supabase
      .from('shared_urls')
      .update({ clicks: (data.clicks || 0) + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating clicks:', updateError);
    }

    return { url: data.long_url };
  } catch (error) {
    console.error('Error in getShareUrl:', error);
    return null;
  }
}
