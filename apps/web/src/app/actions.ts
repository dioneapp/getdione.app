'use server'

export async function getScriptsAction(limit: number = 50) {
  try {
    const response = await fetch(
      `https://api.getdione.app/v1/scripts?limit=${encodeURIComponent(String(limit))}`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return [] as any[];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [] as any[];
  }
}


