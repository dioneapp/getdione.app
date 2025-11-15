'use server';

import { redirect } from 'next/navigation';

export async function getShareUrl(id: string) {
  if (!id) {
    redirect('/');
  }

  try {
    const response = await fetch(
      `https://api.getdione.app/v1/share/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
        },
        next: { revalidate: 0 } // Don't cache this request
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch shared URL');
    }

    const data = await response.json();

    if (!data.longUrl) {
      throw new Error('No URL found');
    }

    return { url: data.longUrl };
  } catch (error) {
    console.error('Error in getShareUrl:', error);
    redirect('/');
  }
}
