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
    // generate initial stars
    const generateStars = () => {
      const newStars = Array.from({ length: 200 }, () => {
        const size = Math.random() < 0.7 
          ? Math.random() * 0.5 + 0.1  // 70% of stars are tiny (0.1-0.6px)
          : Math.random() * 1.5 + 0.5; // 30% are larger (0.5-2px)
        
        return {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          opacity: Math.random() * 0.7 + 0.3, // higher base opacity
          blur: Math.random() < 0.3 ? Math.random() * 0.5 : 0, // some stars are slightly blurred
        };
      });
      setStars(newStars);
    };

    generateStars();

    // animate stars
    const interval = setInterval(() => {
      setStars(prevStars =>
        prevStars.map(star => ({
          ...star,
          opacity: Math.random() * 0.7 + 0.3, // keep stars more visible
        }))
      );
    }, 3000); // slower animation

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

const ProfileBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center"
      aria-hidden="true"
    >
      <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
      <Stars />
    </div>
  );
};

export default ProfileBackground; 