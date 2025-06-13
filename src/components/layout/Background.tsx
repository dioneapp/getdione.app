"use client";

// shared profile background component
import React, { useEffect, useState } from 'react';

// star component for background animation
interface StarProps {
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur?: number;
}

const Star: React.FC<StarProps> = ({ x, y, size, opacity, blur = 0 }) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity,
      filter: blur ? `blur(${blur}px)` : 'none',
      transition: 'opacity 3s ease-in-out',
    }}
  />
);

// stars container component
interface StarData {
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur?: number;
}

const Stars: React.FC = () => {
  const [stars, setStars] = useState<StarData[]>([]);

  useEffect(() => {
    // generate initial stars with stable seed
    const generateStars = () => {
      const newStars = Array.from({ length: 200 }, (_, i) => {
        // use index as part of the seed for stable values
        const seed = i * 0.1;
        const size = Math.sin(seed) < 0.7 
          ? Math.sin(seed * 2) * 0.5 + 0.1  // 70% of stars are tiny
          : Math.sin(seed * 3) * 1.5 + 0.5; // 30% are larger
        
        return {
          x: Math.sin(seed * 4) * 50 + 50, // center around 50%
          y: Math.sin(seed * 5) * 50 + 50, // center around 50%
          size,
          opacity: Math.sin(seed * 6) * 0.35 + 0.35, // between 0.3 and 0.7
          blur: Math.sin(seed * 7) < 0.3 ? Math.sin(seed * 8) * 0.5 : 0,
        };
      });
      setStars(newStars);
    };

    generateStars();

    // animate stars with stable transitions
    const interval = setInterval(() => {
      setStars(prevStars =>
        prevStars.map((star, i) => ({
          ...star,
          opacity: Math.sin(Date.now() * 0.001 + i) * 0.35 + 0.35,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {stars.map((star, index) => (
        <Star key={index} {...star} />
      ))}
    </div>
  );
};

const Background: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex justify-center items-center -z-10"
      aria-hidden="true"
    >
      <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
      <Stars />
    </div>
  );
};

export default Background; 