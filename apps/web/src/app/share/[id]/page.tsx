import { redirect } from 'next/navigation';
import { getShareUrl } from '../actions';

type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

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
