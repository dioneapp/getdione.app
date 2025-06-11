import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* background elements */}
      <div
        className="fixed inset-0 flex justify-center items-center"
        aria-hidden="true"
      >
        <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]">
        </div>
      </div>

      {/* main content */}
      <div
        className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 sm:px-8 pt-24 sm:pt-32 pb-16"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"
          aria-hidden="true"
        >
        </div>

        <svg
          className="animate-float w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mt-8 sm:mt-0"
          width="525"
          height="555"
          viewBox="0 0 525 555"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Dione mascot logo"
          role="img"
        >
          <circle cx="262.5" cy="262.5" r="262.5" fill="white"></circle>
          <circle cx="164" cy="506" r="49" fill="white"></circle>
          <circle cx="359" cy="506" r="49" fill="white"></circle>
          <circle cx="105.483" cy="202.109" r="23.3512" fill="#080808"></circle>
          <circle cx="294.161" cy="202.109" r="23.3512" fill="#080808"></circle>
          <rect
            x="148"
            y="179"
            width="104.613"
            height="46.7025"
            rx="23.3512"
            fill="#080808"></rect>
        </svg>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold text-white tracking-tighter mt-6 text-balance text-center"
        >
          Dione
        </h1>

        <p
          className="mt-4 mb-8 max-w-xl text-center text-base sm:text-lg text-white/80 leading-relaxed text-balance px-4"
          style={{ textRendering: "optimizeLegibility" }}
        >
          <span className="inline-block">
            Discover & install open-source AI apps with Dione. Explore powerful tools, seamless downloads, 1-click installs.
          </span>
        </p>

        <nav
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center w-full max-w-xl gap-3 sm:gap-4"
          aria-label="Primary"
        >
          <a
            href="/github"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
            aria-label="Visit our GitHub repository"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 256 250"
              width="256"
              height="250"
              fill="#080808"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              aria-hidden="true"
              role="img"
            >
              <path
                d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z"
              ></path>
            </svg>
            <span className="font-semibold">GitHub</span>
          </a>

          <a
            href="/beta/join"
            rel="noopener noreferrer"
            className="shrink-0 h-11 sm:h-12 px-8 sm:px-10 flex items-center justify-center bg-white/10 backdrop-blur border border-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            aria-label="Join our beta program"
          >
            Join beta
          </a>

          <a
            href="/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 h-11 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2 rounded-full bg-white text-[#080808] hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg border border-black/10"
            aria-label="Join our Discord community"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 256 199"
              width="256"
              height="199"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              aria-hidden="true"
              role="img"
            >
              <path
                d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
                fill="#080808"></path>
            </svg>
            <span className="font-semibold">Discord</span>
          </a>
        </nav>

        {/* feature cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-18 px-4 max-w-5xl w-full"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">Features</h2>
          {features.map((feature) => (
            <article key={feature.title} className="group p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-white/70">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <p className="text-white/80 text-sm mt-6 text-center">
          Want to know more? Try it now, free!
        </p>
      </div>
    </main>
  );
}

// feature data
const features = [
  {
    title: "Easy Installation",
    description: "One-click install for all your favorite AI tools",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M480-337q-8 0-15-2.5t-13-8.5L308-492q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T365-549l75 75v-286q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v286l75-75q12-12 28.5-11.5T652-548q11 12 11.5 28T652-492L508-348q-6 6-13 8.5t-15 2.5ZM240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Z" />
      </svg>
    ),
  },
  {
    title: "Open Source",
    description: "Community-driven development and transparency",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="m193-479 155 155q11 11 11 28t-11 28q-11 11-28 11t-28-11L108-452q-6-6-8.5-13T97-480q0-8 2.5-15t8.5-13l184-184q12-12 28.5-12t28.5 12q12 12 12 28.5T349-635L193-479Zm574-2L612-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L668-268q-12 12-28 11.5T612-269q-12-12-12-28.5t12-28.5l155-155Z" />
      </svg>
    ),
  },
  {
    title: "Cross Platform",
    description: "Available on Windows, Mac and Linux (coming soon)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M300-410v20q0 13 8.5 21.5T330-360q13 0 21.5-8.5T360-390v-100q0-13-8.5-21.5T330-520q-13 0-21.5 8.5T300-490v20h-30q-13 0-21.5 8.5T240-440q0 13 8.5 21.5T270-410h30Zm130 0h260q13 0 21.5-8.5T720-440q0-13-8.5-21.5T690-470H430q-13 0-21.5 8.5T400-440q0 13 8.5 21.5T430-410Zm230-160h30q13 0 21.5-8.5T720-600q0-13-8.5-21.5T690-630h-30v-20q0-13-8.5-21.5T630-680q-13 0-21.5 8.5T600-650v100q0 13 8.5 21.5T630-520q13 0 21.5-8.5T660-550v-20Zm-390 0h260q13 0 21.5-8.5T560-600q0-13-8.5-21.5T530-630H270q-13 0-21.5 8.5T240-600q0 13 8.5 21.5T270-570ZM160-200q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v40q0 17-11.5 28.5T600-120H360q-17 0-28.5-11.5T320-160v-40H160Z" />
      </svg>
    ),
  },
  {
    title: "Auto Updates",
    description: "Stay current with automatic app updates and notifications",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M148-560q0 58 19.5 111t55.5 98q9 11 9 25t-10 24q-10 10-24.5 9.5T174-304q-45-54-69.5-119.5T80-560q0-71 24.5-136.5T174-816q9-11 23.5-11.5T222-818q10 10 10 24t-9 25q-36 45-55.5 98T148-560Zm132 0q0 32 9 61t27 55q8 11 8 25.5T314-394q-10 10-24 10t-22-11q-27-35-41.5-77.5T212-560q0-45 14.5-87.5T268-725q8-11 22-11t24 10q10 10 10 24.5t-8 25.5q-18 26-27 55t-9 61Zm160 400v-308q-27-12-43.5-37T380-560q0-42 29-71t71-29q42 0 71 29t29 71q0 30-16.5 55T520-468v308q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Zm240-400q0-32-9-61t-27-55q-8-11-8-25.5t10-24.5q10-10 24-10t22 11q27 35 41.5 77.5T748-560q0 45-14.5 87.5T692-395q-8 11-22 11t-24-10q-10-10-10-24.5t8-25.5q18-26 27-55t9-61Zm132 0q0-58-19.5-111T737-769q-9-11-9-25t10-24q10-10 24.5-9.5T786-816q45 54 69.5 119.5T880-560q0 71-24.5 136.5T786-304q-9 11-23.5 11.5T738-302q-10-10-10-24t9-25q36-45 55.5-98T812-560Z" />
      </svg>
    ),
  },
  {
    title: "App Discovery",
    description: "Find and explore new AI tools curated by the community",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
      </svg>
    ),
  },
  {
    title: "Resource Efficient",
    description: "Optimized performance with minimal system impact",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#FFFFFF"
      >
        <path d="M360-360H236q-24 0-35.5-21.5T203-423l299-430q10-14 26-19.5t33 .5q17 6 25 21t6 32l-32 259h155q26 0 36.5 23t-6.5 43L416-100q-11 13-27 17t-31-3q-15-7-23.5-21.5T328-139l32-221Z" />
      </svg>
    ),
  },
];
