import React from 'react';
import { Princess } from '../types/princess';

interface PrincessMessageProps {
  princess: Princess;
}

const PrincessMessage: React.FC<PrincessMessageProps> = ({ princess }) => {
  const getArchetypeDescription = (princess: Princess) => {
    const { feminismPercentage, bitchinessPercentage } = princess;
    
    if (bitchinessPercentage >= 70 && feminismPercentage >= 70) {
      return {
        archetype: "The Independent Warrior",
        description: "You're a trailblazing force who combines fierce determination with progressive values. You don't wait for permission to change the world!"
      };
    } else if (bitchinessPercentage >= 70 && feminismPercentage <= 30) {
      return {
        archetype: "The Traditional Leader",
        description: "You're confidently assertive while respecting time-honored values. You lead with strength and conviction!"
      };
    } else if (bitchinessPercentage <= 30 && feminismPercentage >= 70) {
      return {
        archetype: "The Gentle Revolutionary",
        description: "You create change through kindness and wisdom. Your gentle approach masks a revolutionary spirit!"
      };
    } else if (bitchinessPercentage <= 30 && feminismPercentage <= 30) {
      return {
        archetype: "The Sweet Heart",
        description: "You lead with love and compassion. Your warmth and kindness are your greatest strengths!"
      };
    } else if (bitchinessPercentage >= 50 && feminismPercentage >= 50) {
      return {
        archetype: "The Balanced Trailblazer",
        description: "You perfectly balance strength with progress. You're both fierce and forward-thinking!"
      };
    } else if (bitchinessPercentage >= 50 && feminismPercentage <= 50) {
      return {
        archetype: "The Confident Traditional",
        description: "You blend confidence with classic values. You're strong while honoring tradition!"
      };
    } else if (bitchinessPercentage <= 50 && feminismPercentage >= 50) {
      return {
        archetype: "The Progressive Peacemaker",
        description: "You champion progress through understanding and empathy. Change flows naturally through you!"
      };
    } else {
      return {
        archetype: "The Harmonious Spirit",
        description: "You embody perfect balance in all things. Your equilibrium brings peace to chaos!"
      };
    }
  };

  const { archetype, description } = getArchetypeDescription(princess);

  return (
    <div className="princess-message-container">
      <div className="princess-result-card">
        <div className="princess-header">
          <h2 className="selected-princess-name">You're {princess.name}!</h2>
          <p className="princess-source">From "{princess.source}"</p>
        </div>
        
        <div className="personality-message">
          <div className="main-message">
            <span className="message-text">{princess.personalityMessage}</span>
          </div>
        </div>
        
        <div className="archetype-details">
          <h3 className="archetype-title">{archetype}</h3>
          <p className="archetype-description">{description}</p>
        </div>
        
        <div className="princess-stats">
          <div className="stat-item">
            <span className="stat-label">Feminism</span>
            <div className="stat-bar">
              <div 
                className="stat-fill feminism-fill"
                style={{ width: `${princess.feminismPercentage}%` }}
              ></div>
              <span className="stat-value">{princess.feminismPercentage}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-label">Assertiveness</span>
            <div className="stat-bar">
              <div 
                className="stat-fill assertiveness-fill"
                style={{ width: `${princess.bitchinessPercentage}%` }}
              ></div>
              <span className="stat-value">{princess.bitchinessPercentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="result-actions">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
            aria-label="Go back to princess selection"
          >
            ← Choose Another Princess
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincessMessage;
