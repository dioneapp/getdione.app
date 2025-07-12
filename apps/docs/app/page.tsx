export default function DocsPage() {
  // Demonstrate that environment variables from root .env are accessible
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasGithubToken = !!process.env.GITHUB_TOKEN;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Dione Documentation</h1>
      <p>This is a second app in the monorepo demonstrating shared environment variables.</p>
      
      <h2>Environment Variables Status</h2>
      <ul>
        <li>
          NEXT_PUBLIC_SUPABASE_URL: {hasSupabaseUrl ? '✓ Available' : '✗ Missing'}
        </li>
        <li>
          GITHUB_TOKEN: {hasGithubToken ? '✓ Available' : '✗ Missing'}
        </li>
      </ul>

      <p>
        {hasSupabaseUrl && hasGithubToken 
          ? '✅ All environment variables are being shared correctly!' 
          : '❌ Some environment variables are missing.'}
      </p>
    </div>
  );
}