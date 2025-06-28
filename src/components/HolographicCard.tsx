
import React from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  animationClass?: string;
}

const HolographicCard = ({ children, className = "", animationClass = "" }: HolographicCardProps) => {
  return (
    <div className={`holographic-card rounded-xl overflow-hidden ${animationClass} ${className}`}>
      {children}
    </div>
  );
};

export default HolographicCard;
