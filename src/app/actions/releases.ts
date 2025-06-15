'use server'

export type Release = {
  id: number
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string  
}

export async function getReleases(): Promise<{ data?: Release[]; error?: string }> {
  const token = process.env.GITHUB_TOKEN
  
  if (!token) {
    console.error('No GitHub token configured')
    return { error: 'No GitHub token configured' }
  }

  try {
    const response = await fetch(
      'https://api.github.com/repos/dioneapp/dioneapp/releases',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'dioneapp',
        },
        next: { revalidate: 3600 }, // cache for 1h
      },
    )

    if (!response.ok) {
      const errorMessage = `Failed to fetch releases: ${response.statusText} (${response.status})`
      console.error(errorMessage)
      return { error: errorMessage }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch releases'
    console.error('Error fetching releases:', error)
    return { error: errorMessage }
  }
}