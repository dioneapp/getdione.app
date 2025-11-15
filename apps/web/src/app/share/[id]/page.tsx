import { redirect } from 'next/navigation';
import { getShareUrl } from '../actions';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ShareRedirectPage({ params }: PageProps) {
  const { id } = params;
  
  if (!id) {
    redirect('/');
  }

  try {
    const { url } = await getShareUrl(id);
    redirect(url);
  } catch (error) {
    console.error('Error in ShareRedirectPage:', error);
    redirect('/');
  }
}
