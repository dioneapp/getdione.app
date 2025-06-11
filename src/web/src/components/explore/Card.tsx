'use client';

interface CardProps {
  id: number;
  name: string;
  description: string;
  author: string;
  author_url: string;
  logo_url: string;
  banner_url: string;
  script_url: string;
  version: string;
  tags: string[];
  likes: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export default function Card({
  id,
  name,
  description,
  author,
  author_url,
  logo_url,
  banner_url,
  version,
  likes,
  downloads,
  created_at,
}: CardProps) {
  const formattedDate = new Date(created_at).toLocaleDateString();

  return (
    <article
      onClick={() => window.location.href = `dione://download=${id}`}
      className="group relative p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg cursor-pointer w-full h-full flex flex-col"
    >
      {banner_url && (
        <div
          className="absolute top-0 left-0 w-full h-24 rounded-t-xl bg-cover bg-center bg-no-repeat blur-xl opacity-40 -z-10"
          style={{ backgroundImage: `url(${banner_url})` }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={logo_url || '/favicon.ico'}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white">{name}</h3>
            <a
              href={author_url}
              className="text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              {author}
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-sm sm:text-base text-white/70 mb-4 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto pt-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {version && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                    >
                      <path
                        fill="currentColor"
                        d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Z"
                      />
                    </svg>
                    v{version}
                  </span>
                )}
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M16 13h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1zm0-10v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V3c0-.55-.45-1-1-1s-1 .45-1 1zm2 17H6c-.55 0-1-.45-1-1V9h14v10c0 .55-.45 1-1 1z" />
                  </svg>
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path
                      fill="currentColor"
                      d="M840-640q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14H400q-33 0-56.5-23.5T320-200v-407q0-16 6.5-30.5T344-663l217-216q15-14 35.5-17t39.5 7q19 10 27.5 28t3.5 37l-45 184h218ZM160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640q33 0 56.5 23.5T240-560v360q0 33-23.5 56.5T160-120Z"
                    />
                  </svg>
                  {likes}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  {downloads}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 