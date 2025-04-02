import React from 'react';

type FeatureCardProps = {
  name: string;
  icon: string;
};

export const FeatureCard: React.FC<FeatureCardProps> = ({ name, icon }) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-opacity-70">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1`}>
        <img src={icon} alt={name} className="w-10 h-10 rounded-full" />
      </div>
      <span className="text-xs text-white text-center">{name}</span>
    </div>
  );
};
