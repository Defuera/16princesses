import React, { useState } from 'react';
import { Princess } from '../../types/princess';

interface PrincessInfoProps {
  princess: Princess;
  className?: string;
}

export const PrincessInfo: React.FC<PrincessInfoProps> = ({ 
  princess, 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
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
            onError={() => {
              console.log('Image failed to load:', princess.imageUrl);
              setImageError(true);
            }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', princess.imageUrl);
                      setImageError(false);
                    }}
            style={{ display: imageError ? 'none' : 'block' }}
          />
          {imageError && (
            <div className="image-placeholder" role="img" aria-label={`${princess.name} image placeholder`}>
              <span className="placeholder-text" aria-hidden="true">👑</span>
              <span className="image-label">Princess Image</span>
            </div>
          )}
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
