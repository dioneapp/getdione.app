import { useRouter } from "next/navigation";

interface ProfileStatesProps {
  loading?: boolean;
  error?: string | null;
  onReturnHome?: () => void;
}

export default function ProfileStates({
  loading = false,
  error = null,
  onReturnHome,
}: ProfileStatesProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
        <div className="h-fit w-full flex max-w-xl">
          <div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
            <h1 className="text-white text-3xl font-semibold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center w-full min-h-[100dvh] justify-center p-12 pt-6 relative">
        <div className="h-fit w-full flex max-w-xl">
          <div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-12 flex flex-col items-start justify-start shadow-lg shadow-black/10 w-full h-full">
            <h1 className="text-white text-3xl font-semibold">Error</h1>
            <p className="mt-2 text-red-400">{error}</p>
            <button
              onClick={onReturnHome || (() => router.push("/"))}
              className="mt-4 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 