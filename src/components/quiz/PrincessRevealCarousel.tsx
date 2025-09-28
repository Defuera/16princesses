import React, { useState, useEffect, useRef } from 'react';
import { 
  PrincessRevealCarouselProps, 
  CarouselState
} from '../../types/animation';
import { Princess } from '../../types/princess';
import { 
  announceToScreenReader, 
  KeyboardNavigation
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
    isTransitioning: false,
    highlightedOnGraph: null
  });

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

  // Handle carousel visibility - show immediately when revealed
  useEffect(() => {
    if (revealed) {
      setCarouselState(prev => ({ ...prev, isVisible: true }));
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

      // Scroll to description section
      const descriptionElement = document.querySelector('.princess-info-section');
      if (descriptionElement) {
        descriptionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }

      // Announce selection to screen readers
      announceToScreenReader(
        `Selected ${princess.name} from ${princess.source}. ${princess.heroineScore}% Heroine, ${princess.bitchScore}% Bitch.`
      );

      // Clear transition state after animation
      setTimeout(() => {
        setCarouselState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    }
  };


  return (
    <div className={`princess-reveal-carousel ${className}`}>
      {/* Horizontal Princess Scroll Carousel */}
      {revealed && (
        <div className="horizontal-princess-carousel">
          <div 
            className="princess-scroll-container"
            role="region"
            aria-label="Princess selection carousel"
          >
            <div className="princess-scroll-track">
              {allPrincesses.map((princess, index) => {
                const isSelected = selectedPrincess?.id === princess.id;
                const isUserMatch = princess.id === quizResult.matchedPrincess.id;
              
              return (
                <button
                  key={princess.id}
                  type="button"
                  className={`princess-scroll-item ${isSelected ? 'selected' : ''} ${isUserMatch ? 'user-match' : ''}`}
                  onClick={() => handlePrincessSelect(princess, index)}
                  aria-label={`${princess.name} from ${princess.source}. ${princess.heroineScore}% Heroine, ${princess.bitchScore}% Bitch. Click to view details. ${isUserMatch ? 'Your matched princess' : ''}`}
                >
                  <div className="princess-photo">
                    <img 
                      src={princess.imageUrl}
                      alt={`${princess.name} from ${princess.source}`}
                      className="carousel-princess-image"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="photo-placeholder hidden">
                      <span className="photo-icon" aria-hidden="true">👑</span>
                    </div>
                    {isUserMatch && (
                      <div className="match-badge" aria-label="Your match">★</div>
                    )}
                  </div>
                  <span className="princess-scroll-name">{princess.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PrincessRevealCarousel;