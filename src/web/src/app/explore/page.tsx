import { supabase } from '@/utils/database';
import Card from '@/components/explore/Card';

async function getScripts() {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(24);

  if (error) {
    console.error('Error fetching scripts:', error);
    return [];
  }

  return data;
}

export default async function ExplorePage() {
  const scripts = await getScripts();

  return (
    <main>
      <div
        className="fixed inset-0 flex justify-center items-center"
        aria-hidden="true"
      >
        <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
          aria-hidden="true"
        />

        <h1 className="text-5xl font-semibold text-white tracking-tighter mt-6 text-balance text-center">
          Explore
        </h1>
        <p
          className="mt-4 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          Explore the latest available applications at Dione.
        </p>

        <section
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl"
          aria-labelledby="features-heading"
        >
          {scripts.map((script) => (
            <Card
              key={script.id}
              id={script.id}
              name={script.name}
              description={script.description}
              author={script.author}
              author_url={script.author_url}
              logo_url={script.logo_url}
              banner_url={script.banner_url}
              script_url={script.script_url}
              version={script.version}
              tags={script.tags}
              likes={script.likes}
              downloads={script.downloads}
              created_at={script.created_at}
              updated_at={script.updated_at}
            />
          ))}
        </section>
        <p className="text-white/80 text-sm mt-6 text-center">
          Want to see more? Check out the{' '}
          <a href="/" rel="noopener" className="underline">
            Home
          </a>{' '}
          for more details.
        </p>
      </div>
    </main>
  );
} 