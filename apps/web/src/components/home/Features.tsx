import { motion } from "framer-motion";
import type React from "react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type FeaturesProps = {
  features: Feature[];
};

export default function Features({ features }: FeaturesProps) {
  return (
    <motion.section
      className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 px-4 max-w-5xl w-full"
      aria-labelledby="features-heading"
    >
      {/* Background effects */}
      <div aria-hidden className="grid-light-effect"></div>
      <div aria-hidden className="center-radial-glow"></div>
      <h2 id="features-heading" className="sr-only">
        Features
      </h2>
      {features.map((feature, i) => (
        <motion.article
          key={feature.title}
          className="group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg"
        >
          {/* subtle inner glow stripe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 h-14 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),rgba(255,255,255,0.04)_60%,transparent_70%)] blur-xl opacity-60"
          />
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-sm sm:text-base text-white/70 max-w-[28ch] sm:max-w-[34ch]">
            {feature.description}
          </p>
        </motion.article>
      ))}
    </motion.section>
  );
}
