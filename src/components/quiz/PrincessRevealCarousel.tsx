import React, { useState, useEffect, useRef } from 'react';
import { 
  PrincessRevealCarouselProps, 
  CarouselState, 
  RevealData,
  RevealMessage 
} from '../../types/animation';
import { Princess } from '../../types/princess';
import { 
  announceToScreenReader, 
  KeyboardNavigation, 
  focusManager 
} from '../../utils/accessibility';

const PrincessRevealCarousel: React.FC<PrincessRevealCarouselProps> = ({
  quizResult,
  allPrincesses,
  revealed = false,
  onPrincessSelect,
  selectedPrincess,
  className = ''
}) => {
  const [carouselState, setCarouselState] = useState<CarouselState>({
    selectedIndex: 0,
    isVisible: false,
    selectedPrincess: null,
    isTransitioning: false
  });

  const [revealData, setRevealData] = useState<RevealData>({ princesses: [] });
  const carouselRef = useRef<HTMLDivElement>(null);
  const keyboardNavRef = useRef<KeyboardNavigation | null>(null);

  // Initialize carousel with user's matched princess
  useEffect(() => {
    const matchedIndex = allPrincesses.findIndex(p => p.id === quizResult.matchedPrincess.id);
    if (matchedIndex >= 0) {
      setCarouselState(prev => ({
        ...prev,
        selectedIndex: matchedIndex,
        selectedPrincess: allPrincesses[matchedIndex]
      }));
    }
  }, [allPrincesses, quizResult.matchedPrincess.id]);

  // Load reveal.json data
  useEffect(() => {
    const loadRevealData = async () => {
      try {
        const response = await fetch('/docs/reveal.json');
        const data = await response.json();
        setRevealData(data);
      } catch (error) {
        console.warn('Failed to load reveal data:', error);
        setRevealData({ princesses: [] });
      }
    };

    loadRevealData();
  }, []);

  // Set up keyboard navigation
  useEffect(() => {
    if (carouselRef.current) {
      const thumbnails = carouselRef.current.querySelectorAll('[data-princess-id]') as NodeListOf<HTMLElement>;
      
      keyboardNavRef.current = new KeyboardNavigation(
        Array.from(thumbnails),
        (index, item) => {
          const princessId = item.getAttribute('data-princess-id');
          const princess = allPrincesses.find(p => p.id === princessId);
          if (princess) {
            handlePrincessSelect(princess, index);
          }
        }
      );
    }

    return () => {
      keyboardNavRef.current = null;
    };
  }, [allPrincesses]);

  // Handle carousel visibility
  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => {
        setCarouselState(prev => ({ ...prev, isVisible: true }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [revealed]);

  // Sync external selection with internal state
  useEffect(() => {
    if (selectedPrincess) {
      const index = allPrincesses.findIndex(p => p.id === selectedPrincess.id);
      if (index >= 0 && index !== carouselState.selectedIndex) {
        setCarouselState(prev => ({
          ...prev,
          selectedIndex: index,
          selectedPrincess: selectedPrincess
        }));
      }
    }
  }, [selectedPrincess, allPrincesses, carouselState.selectedIndex]);

  // Get reveal message for a princess
  const getRevealMessage = (princessName: string): string => {
    const revealPrincess = revealData.princesses.find(p => p.name === princessName);
    return revealPrincess?.description || 
      "You're a unique princess archetype! Your combination of traits creates an interesting personality profile.";
  };

  // Handle princess selection
  const handlePrincessSelect = (princess: Princess, index?: number) => {
    const princessIndex = index !== undefined ? index : allPrincesses.findIndex(p => p.id === princess.id);
    
    if (princessIndex >= 0) {
      setCarouselState(prev => ({
        ...prev,
        selectedIndex: princessIndex,
        selectedPrincess: princess,
        isTransitioning: true
      }));

      // Update keyboard navigation focus
      keyboardNavRef.current?.setCurrentIndex(princessIndex);

      // Call callback for graph highlighting
      onPrincessSelect?.(princess);

      // Announce selection to screen readers
      announceToScreenReader(
        `Selected ${princess.name} from ${princess.source}. ${princess.feminismPercentage}% Heroine, ${princess.bitchinessPercentage}% Bitch.`
      );

      // Clear transition state after animation
      setTimeout(() => {
        setCarouselState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    }
  };

  // Navigation handlers
  const handleNavigation = (direction: 'prev' | 'next') => {
    const currentIndex = carouselState.selectedIndex;
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? allPrincesses.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === allPrincesses.length - 1 ? 0 : currentIndex + 1;
    }

    const newPrincess = allPrincesses[newIndex];
    if (newPrincess) {
      handlePrincessSelect(newPrincess, newIndex);
    }
  };

  // Keyboard event handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (keyboardNavRef.current?.handleKeyDown(event.nativeEvent)) {
      // Keyboard navigation handled the event
      return;
    }

    // Additional carousel-specific keyboard shortcuts
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        handlePrincessSelect(allPrincesses[0], 0);
        break;
      case 'End':
        event.preventDefault();
        const lastIndex = allPrincesses.length - 1;
        handlePrincessSelect(allPrincesses[lastIndex], lastIndex);
        break;
    }
  };

  const currentPrincess = carouselState.selectedPrincess || quizResult.matchedPrincess;
  const currentRevealMessage = getRevealMessage(currentPrincess.name);

  return (
    <div className={`princess-reveal-carousel ${className}`}>
      {/* Main reveal message for matched princess */}
      {revealed && (
        <div className="reveal-message-container fade-in" role="article" aria-label="Your princess match">
          <div className="matched-princess-card">
            <div className="princess-image-placeholder">
              <div className="image-placeholder" role="img" aria-label="Princess image placeholder">
                <span className="placeholder-text" aria-hidden="true">👑</span>
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

      {/* Princess exploration carousel */}
      {carouselState.isVisible && allPrincesses.length > 0 && (
        <div 
          className="princess-carousel slide-up"
          role="region"
          aria-label="Princess carousel for exploration"
          ref={carouselRef}
        >
          <div className="carousel-header">
            <h4>Explore All Princesses</h4>
            <p className="sr-only">Use arrow keys to navigate, Enter or Space to select princesses</p>
            <p>Click on any princess to see their description and position on the graph</p>
          </div>

          {/* Current princess display */}
          <div className="current-princess-display">
            <div className={`carousel-princess-card ${carouselState.isTransitioning ? 'transitioning' : ''}`}>
              <div className="carousel-image-placeholder">
                <div className="image-placeholder" role="img" aria-label={`${currentPrincess.name} image placeholder`}>
                  <span className="placeholder-text" aria-hidden="true">👑</span>
                </div>
              </div>
              
              <div className="carousel-princess-details">
                <h5 className="carousel-princess-name">{currentPrincess.name}</h5>
                <p className="carousel-princess-source">from {currentPrincess.source}</p>
                
                <div className="carousel-reveal-message">
                  <p>{currentRevealMessage}</p>
                </div>
                
                <div className="carousel-princess-stats">
                  <div className="carousel-stat">
                    <span>Heroine: {currentPrincess.feminismPercentage}%</span>
                  </div>
                  <div className="carousel-stat">
                    <span>Bitch: {currentPrincess.bitchinessPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="carousel-controls">
              <button 
                type="button"
                className="carousel-nav-btn prev"
                onClick={() => handleNavigation('prev')}
                aria-label="Previous princess"
              >
                ← Previous
              </button>
              <span className="carousel-counter" aria-live="polite">
                {carouselState.selectedIndex + 1} of {allPrincesses.length}
              </span>
              <button 
                type="button"
                className="carousel-nav-btn next"
                onClick={() => handleNavigation('next')}
                aria-label="Next princess"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Princess thumbnail grid */}
          <div 
            className="princess-thumbnails"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="grid"
            aria-label="Princess selection grid"
          >
            <div className="thumbnails-grid" role="row">
              {allPrincesses.map((princess, index) => {
                const isSelected = index === carouselState.selectedIndex;
                const isUserMatch = princess.id === quizResult.matchedPrincess.id;
                
                return (
                  <button
                    key={princess.id}
                    type="button"
                    className={`princess-thumbnail ${isSelected ? 'selected' : ''} ${isUserMatch ? 'user-match' : ''}`}
                    onClick={() => handlePrincessSelect(princess, index)}
                    data-princess-id={princess.id}
                    role="gridcell"
                    aria-label={`${princess.name} from ${princess.source}. ${princess.feminismPercentage}% Heroine, ${princess.bitchinessPercentage}% Bitch. ${isUserMatch ? 'Your matched princess' : ''}`}
                    tabIndex={isSelected ? 0 : -1}
                  >
                    <div className="thumbnail-image">
                      <span className="thumbnail-placeholder" aria-hidden="true">👑</span>
                    </div>
                    <span className="thumbnail-name">{princess.name}</span>
                    {isUserMatch && (
                      <div className="match-indicator" aria-label="Your match">★ Your Match</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live region for selection announcements */}
          <div 
            id="carousel-live-region"
            className="live-region" 
            aria-live="polite" 
            aria-atomic="true"
          />
        </div>
      )}
    </div>
  );
};

export default PrincessRevealCarousel;