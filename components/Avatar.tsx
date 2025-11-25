
import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ config, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-48 h-48 text-7xl'
  };

  return (
    <div className={`relative rounded-full flex items-center justify-center border-4 border-white shadow-lg ${config.baseColor} ${sizeClasses[size]} ${className}`}>
      {/* Accessory on top */}
      <span className="absolute -top-1/4 left-1/2 transform -translate-x-1/2 z-10">
        {config.accessory}
      </span>
      
      {/* Face (simplified as text for now, could be SVG) */}
      <span className="select-none filter drop-shadow-md">
        {config.expression === 'aa' ? '🦁' : '🦁'}
      </span>
      
      {/* Optional: Add more layers for eyes/mouth if using SVGs later */}
    </div>
  );
};
