"use client";

export default function ExploreCarouselSkeleton() {
  const placeholdersPerRow = 8;

  return (
    <section className="w-full max-w-7xl mt-10 relative">
      <div className="space-y-4">
        {/* Top row */}
        <div className="overflow-hidden mask-fade">
          <div className="flex gap-4">
            {Array.from({ length: placeholdersPerRow }).map((_, idx) => (
              <div key={`skeleton-top-${idx}`} className="shrink-0 w-[260px] sm:w-[300px]">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="overflow-hidden mask-fade">
          <div className="flex gap-4">
            {Array.from({ length: placeholdersPerRow }).map((_, idx) => (
              <div key={`skeleton-bottom-${idx}`} className="shrink-0 w-[260px] sm:w-[300px]">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade {
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
                  mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);
          -webkit-mask-size: 100% 100%;
                  mask-size: 100% 100%;
        }
      `}</style>
    </section>
  );
}

function SkeletonCard() {
  return (
    <article className="relative p-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 shadow-lg h-full flex flex-col animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-white/10 border border-white/10" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-36 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full bg-white/10 rounded" />
        <div className="h-3 w-[90%] bg-white/10 rounded" />
        <div className="h-3 w-[80%] bg-white/10 rounded" />
      </div>
    </article>
  );
}


