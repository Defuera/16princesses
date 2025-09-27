import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPrincesses } from '../data/princessData';
import { Princess } from '../types/princess';

const PrincessList: React.FC = () => {
  const navigate = useNavigate();
  const princesses = getAllPrincesses();

  const handlePrincessSelect = (princess: Princess) => {
    navigate(`/result/${princess.id}`);
  };

  return (
    <div className="princess-list-container">
      <header className="app-header">
        <h1>16Princesses Test</h1>
        <p>Discover which princess archetype matches your personality!</p>
      </header>
      
      <div className="princess-grid">
        {princesses.map((princess) => (
          <button
            key={princess.id}
            className="princess-card"
            onClick={() => handlePrincessSelect(princess)}
            aria-label={`Select ${princess.name} from ${princess.source}`}
          >
            <div className="princess-info">
              <h3 className="princess-name">{princess.name}</h3>
              <p className="princess-source">{princess.source}</p>
              <div className="princess-traits">
                <span className="trait">
                  Feminism: {princess.feminismPercentage}%
                </span>
                <span className="trait">
                  Assertiveness: {princess.bitchinessPercentage}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <footer className="app-footer">
        <p>Choose a princess to see your personality match!</p>
      </footer>
    </div>
  );
};

export default PrincessList;
