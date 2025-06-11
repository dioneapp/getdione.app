'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/database'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAppLogin = searchParams.get('app') === 'true'
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (!accessToken) {
          throw new Error('No access token found in URL')
        }

        // set the session in supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        })

        if (sessionError) {
          throw sessionError
        }

        // encode tokens
        const encodedAccessToken = encodeURIComponent(accessToken)
        const encodedRefreshToken = refreshToken ? encodeURIComponent(refreshToken) : ''
        
        let redirectUrl
        if (isAppLogin) {
          // app login - redirect to dione:// protocol
          redirectUrl = `dione://auth=${encodedAccessToken}${encodedRefreshToken ? `&refresh=${encodedRefreshToken}` : ''}`
        } else {
          // web login - redirect to profile page
          redirectUrl = '/profile'
        }

        // try redirect
        window.location.replace(redirectUrl)
        
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
      }
    }

    handleCallback()
  }, [isAppLogin])

  return (
    <div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
      <div className="fixed inset-0 flex justify-center items-center" aria-hidden="true">
        <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
      </div>
      <div className="h-fit w-full flex max-w-xl">
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
          <h1 className="text-white text-3xl font-semibold">Redirecting...</h1>
          <h2 className="mt-2 text-white/70">
            {isAppLogin ? "We are redirecting you to Dione app in a few seconds." : "We are redirecting you to your profile page."}
          </h2>
          {error && (
            <div className="mt-4 text-red-400 text-sm">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 