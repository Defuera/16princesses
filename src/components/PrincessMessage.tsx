import React from 'react';
import { Princess } from '../types/princess';

interface QuizScores {
  xScore: number;
  yScore: number;
}

interface PrincessMessageProps {
  princess: Princess;
  isQuizResult?: boolean;
  userScores?: QuizScores;
}

const PrincessMessage: React.FC<PrincessMessageProps> = ({ 
  princess, 
  isQuizResult = false, 
  userScores 
}) => {
  const getArchetypeDescription = (feminism: number, assertiveness: number) => {
    // Use user scores if from quiz, otherwise princess scores
    const feminismPercentage = feminism;
    const bitchinessPercentage = assertiveness;
    
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

  // Get scores to use (user's calculated scores or princess's fixed scores)
  const displayFeminism = userScores?.xScore ?? princess.feminismPercentage;
  const displayAssertiveness = userScores?.yScore ?? princess.bitchinessPercentage;
  
  const { archetype, description } = getArchetypeDescription(displayFeminism, displayAssertiveness);

  // Get appropriate messaging based on context
  const getHeaderMessage = () => {
    if (isQuizResult) {
      return `Your princess match: ${princess.name}!`;
    }
    return `You're ${princess.name}!`;
  };

  const getPersonalityMessage = () => {
    if (isQuizResult && userScores) {
      // Generate quiz-specific message
      return `Based on your quiz responses, you're ${displayFeminism.toFixed(1)}% Heroine and ${displayAssertiveness.toFixed(1)}% Fierce—just like ${princess.name} from ${princess.source}!`;
    }
    return princess.personalityMessage;
  };

  return (
    <div className="princess-message-container">
      <div className="princess-result-card">
        <div className="princess-header">
          <h2 className="selected-princess-name">{getHeaderMessage()}</h2>
          <p className="princess-source">From "{princess.source}"</p>
          {isQuizResult && (
            <div className="quiz-result-badge">
              <span className="badge-text">✨ Quiz Result</span>
            </div>
          )}
        </div>
        
        <div className="personality-message">
          <div className="main-message">
            <span className="message-text">{getPersonalityMessage()}</span>
          </div>
        </div>
        
        <div className="archetype-details">
          <h3 className="archetype-title">{archetype}</h3>
          <p className="archetype-description">{description}</p>
        </div>
        
        <div className="princess-stats">
          <div className="stat-item">
            <span className="stat-label">
              {isQuizResult ? "Your Heroine Level" : "Feminism"}
            </span>
            <div className="stat-bar">
              <div 
                className="stat-fill feminism-fill"
                style={{ width: `${displayFeminism}%` }}
              ></div>
              <span className="stat-value">{displayFeminism.toFixed(1)}%</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-label">
              {isQuizResult ? "Your Fierce Factor" : "Assertiveness"}
            </span>
            <div className="stat-bar">
              <div 
                className="stat-fill assertiveness-fill"
                style={{ width: `${displayAssertiveness}%` }}
              ></div>
              <span className="stat-value">{displayAssertiveness.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        {isQuizResult && userScores && (
          <div className="quiz-comparison">
            <h4>Princess Comparison</h4>
            <div className="comparison-stats">
              <div className="comparison-item">
                <span className="comparison-label">{princess.name}'s Heroine Level:</span>
                <span className="comparison-value">{princess.feminismPercentage}%</span>
              </div>
              <div className="comparison-item">
                <span className="comparison-label">{princess.name}'s Fierce Factor:</span>
                <span className="comparison-value">{princess.bitchinessPercentage}%</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="result-actions">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
            aria-label={isQuizResult ? "Go back to quiz" : "Go back to princess selection"}
          >
            {isQuizResult ? "← Back to Quiz" : "← Choose Another Princess"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrincessMessage;
