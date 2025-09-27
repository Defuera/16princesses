import React, { useState, useEffect } from 'react';
import { Princess } from '../../types/princess';
import { QuizResult } from '../../types/quiz';
import { getAllPrincesses } from '../../data/princessData';

interface RevealPrincess {
  name: string;
  description: string;
}

interface PrincessRevealCarouselProps {
  quizResult: QuizResult;
  revealed?: boolean;
  onPrincessSelect?: (princess: Princess) => void;
}

export const PrincessRevealCarousel: React.FC<PrincessRevealCarouselProps> = ({
  quizResult,
  revealed = false,
  onPrincessSelect
}) => {
  const [allPrincesses, setAllPrincesses] = useState<Princess[]>([]);
  const [revealPrincesses, setRevealPrincesses] = useState<RevealPrincess[]>([]);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number>(0);
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);

  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
    
    // Find the index of the matched princess for carousel
    const matchedIndex = princesses.findIndex(p => p.id === quizResult.matchedPrincess.id);
    if (matchedIndex >= 0) {
      setSelectedCarouselIndex(matchedIndex);
    }
  }, [quizResult.matchedPrincess.id]);

  useEffect(() => {
    // Load reveal data
    const loadRevealData = async () => {
      try {
        const response = await fetch('/docs/reveal.json');
        const data = await response.json();
        setRevealPrincesses(data.princesses);
      } catch (error) {
        console.error('Failed to load reveal data:', error);
        // Fallback to empty array
        setRevealPrincesses([]);
      }
    };

    loadRevealData();
  }, []);

  useEffect(() => {
    if (revealed) {
      // Show carousel after a delay
      const timer = setTimeout(() => {
        setIsCarouselVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [revealed]);

  const getRevealMessage = (princessName: string): string => {
    const revealPrincess = revealPrincesses.find(p => p.name === princessName);
    return revealPrincess?.description || "You're a unique princess archetype! Your combination of traits creates an interesting personality profile.";
  };

  const handleCarouselNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedCarouselIndex(prev => 
        prev === 0 ? allPrincesses.length - 1 : prev - 1
      );
    } else {
      setSelectedCarouselIndex(prev => 
        prev === allPrincesses.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrincessClick = (princess: Princess) => {
    const princessIndex = allPrincesses.findIndex(p => p.id === princess.id);
    if (princessIndex >= 0) {
      setSelectedCarouselIndex(princessIndex);
    }
    onPrincessSelect?.(princess);
  };

  const currentCarouselPrincess = allPrincesses[selectedCarouselIndex];
  const carouselRevealMessage = currentCarouselPrincess ? getRevealMessage(currentCarouselPrincess.name) : '';

  return (
    <div className="princess-reveal-carousel">
      {/* Main reveal message for matched princess */}
      {revealed && (
        <div className="reveal-message-container fade-in">
          <div className="matched-princess-card">
            <div className="princess-image-placeholder">
              <div className="image-placeholder">
                <span className="placeholder-text">👑</span>
                <span className="image-label">Princess Image</span>
              </div>
            </div>
            
            <div className="princess-details">
              <h3 className="princess-name">{quizResult.matchedPrincess.name}</h3>
              <p className="princess-source">from {quizResult.matchedPrincess.source}</p>
              
              <div className="reveal-message">
                <p>{getRevealMessage(quizResult.matchedPrincess.name)}</p>
              </div>
              
              <div className="princess-stats">
                <div className="stat">
                  <span className="stat-label">Heroine Level:</span>
                  <span className="stat-value">{quizResult.xScore}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Bitch Factor:</span>
                  <span className="stat-value">{quizResult.yScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Princess carousel for exploration */}
      {isCarouselVisible && allPrincesses.length > 0 && (
        <div className="princess-carousel slide-up">
          <div className="carousel-header">
            <h4>Explore All Princesses</h4>
            <p>Click on any princess to see their description and position on the graph</p>
          </div>

          {/* Current princess display */}
          {currentCarouselPrincess && (
            <div className="current-princess-display">
              <div className="carousel-princess-card">
                <div className="carousel-image-placeholder">
                  <div className="image-placeholder">
                    <span className="placeholder-text">👑</span>
                  </div>
                </div>
                
                <div className="carousel-princess-details">
                  <h5 className="carousel-princess-name">{currentCarouselPrincess.name}</h5>
                  <p className="carousel-princess-source">from {currentCarouselPrincess.source}</p>
                  
                  <div className="carousel-reveal-message">
                    <p>{carouselRevealMessage}</p>
                  </div>
                  
                  <div className="carousel-princess-stats">
                    <div className="carousel-stat">
                      <span>Heroine: {currentCarouselPrincess.feminismPercentage}%</span>
                    </div>
                    <div className="carousel-stat">
                      <span>Bitch: {currentCarouselPrincess.bitchinessPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation controls */}
              <div className="carousel-controls">
                <button 
                  className="carousel-nav-btn prev"
                  onClick={() => handleCarouselNavigation('prev')}
                >
                  ← Previous
                </button>
                <span className="carousel-counter">
                  {selectedCarouselIndex + 1} of {allPrincesses.length}
                </span>
                <button 
                  className="carousel-nav-btn next"
                  onClick={() => handleCarouselNavigation('next')}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Princess thumbnail grid */}
          <div className="princess-thumbnails">
            <div className="thumbnails-grid">
              {allPrincesses.map((princess, index) => (
                <button
                  key={princess.id}
                  className={`princess-thumbnail ${index === selectedCarouselIndex ? 'active' : ''} ${princess.id === quizResult.matchedPrincess.id ? 'matched' : ''}`}
                  onClick={() => handlePrincessClick(princess)}
                  title={`${princess.name} - ${princess.source}`}
                >
                  <div className="thumbnail-image">
                    <span className="thumbnail-placeholder">👑</span>
                  </div>
                  <span className="thumbnail-name">{princess.name}</span>
                  {princess.id === quizResult.matchedPrincess.id && (
                    <div className="match-indicator">★ Your Match</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincessRevealCarousel;
