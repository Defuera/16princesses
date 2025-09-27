import React from 'react';
import { Princess } from '../../types/princess';

interface PrincessInfoProps {
  princess: Princess;
  className?: string;
}

export const PrincessInfo: React.FC<PrincessInfoProps> = ({ 
  princess, 
  className = '' 
}) => {
  return (
    <div className={`princess-info-section ${className}`}>
      {/* 1. Description */}
      <div className="reveal-message">
        <p>{princess.description}</p>
      </div>
      
      {/* 2. Image */}
      <div className="princess-image-display">
        <div className="princess-image-placeholder">
          <img 
            src={princess.imageUrl}
            alt={`${princess.name} from ${princess.source}`}
            className="princess-image"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="image-placeholder hidden" role="img" aria-label={`${princess.name} image placeholder`}>
            <span className="placeholder-text" aria-hidden="true">👑</span>
            <span className="image-label">Princess Image</span>
          </div>
        </div>
      </div>

      {/* 3. Name */}
      <div className="princess-description">
        <h3>{princess.name}</h3>
        {/* 4. Where from */}
        <p className="princess-source">from {princess.source}</p>
      </div>
    </div>
  );
};

export default PrincessInfo;
