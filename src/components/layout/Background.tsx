import React from 'react';

const Background: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex justify-center items-center -z-10"
      aria-hidden="true"
    >
      <div className="bg-[#BCB1E7]/30 h-[70vh] w-[70vh] rounded-full blur-[150px]"></div>
    </div>
  );
};

export default Background; 