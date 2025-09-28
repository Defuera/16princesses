import { Princess, PrincessData } from '../types/princess';
import unifiedPrincessesData from './unified-princesses.json';

/**
 * Load princess data from JSON file
 */
export function loadPrincessData(): PrincessData {
  const data = {
    ...unifiedPrincessesData,
    metadata: {
      totalCount: unifiedPrincessesData.princesses.length,
      dataSource: "unified-princesses.json",
      generator: "16Princesses Test"
    }
  };
  return data as PrincessData;
}

/**
 * Get all princesses
 */
export function getAllPrincesses(): Princess[] {
  const data = loadPrincessData();
  return data.princesses;
}

/**
 * Find a princess by ID
 */
export function getPrincessById(id: string): Princess | undefined {
  const princesses = getAllPrincesses();
  return princesses.find(princess => princess.id === id);
}

/**
 * Generate personality message based on feminism and bitchiness percentages
 */
export function generatePersonalityMessage(feminism: number, bitchiness: number): string {
  if (bitchiness >= 70 && feminism >= 70) {
    return "You're a fierce, independent force! 👑";
  } else if (bitchiness >= 70 && feminism <= 30) {
    return "You're assertive with traditional values! 💪";
  } else if (bitchiness <= 30 && feminism >= 70) {
    return "You're a gentle revolutionary! 🌸";
  } else if (bitchiness <= 30 && feminism <= 30) {
    return "You're such a sweetheart! 💖";
  } else if (bitchiness >= 50 && feminism >= 50) {
    return "You're a balanced trailblazer! ✨";
  } else if (bitchiness >= 50 && feminism <= 50) {
    return "You're confidently traditional! 🌺";
  } else if (bitchiness <= 50 && feminism >= 50) {
    return "You're kindly progressive! 🦋";
  } else {
    return "You're beautifully balanced! 💝";
  }
}

/**
 * Validate princess data structure
 */
export function validatePrincess(princess: any): princess is Princess {
  return (
    typeof princess === 'object' &&
    princess !== null &&
    typeof princess.id === 'string' &&
    typeof princess.name === 'string' &&
    typeof princess.source === 'string' &&
    typeof princess.feminismPercentage === 'number' &&
    typeof princess.bitchinessPercentage === 'number' &&
    typeof princess.personalityMessage === 'string' &&
    princess.feminismPercentage >= 0 &&
    princess.feminismPercentage <= 100 &&
    princess.bitchinessPercentage >= 0 &&
    princess.bitchinessPercentage <= 100
  );
}

/**
 * Transform princess data for Chart.js scatter plot
 */
export function transformForChart(princesses: Princess[]) {
  return princesses.map(princess => ({
    x: princess.feminismPercentage,
    y: princess.bitchinessPercentage,
    label: princess.name,
    princess: princess
  }));
}

/**
 * Get default graph configuration
 */
export function getDefaultGraphConfig() {
  return {
    title: "16Princesses Test - Your Princess Archetype",
    xAxis: {
      label: "Patriarchal → Feminist",
      min: 0,
      max: 100,
      tickInterval: 25
    },
    yAxis: {
      label: "Sweet → Assertive",
      min: 0,
      max: 100,
      tickInterval: 25
    },
    plotArea: {
      backgroundColor: "#fafafa",
      gridLineColor: "#e0e0e0",
      showGrid: true
    },
    styling: {
      selectedPrincess: {
        color: "#ff6b9d",
        size: 12,
        borderWidth: 3
      },
      unselectedPrincess: {
        color: "#c7ceea",
        size: 8,
        opacity: 0.6
      },
      hoverEffect: {
        scale: 1.2,
        borderColor: "#333"
      }
    }
  };
}

/**
 * Get graph configuration optimized for quiz results
 */
export function getQuizGraphConfig() {
  const baseConfig = getDefaultGraphConfig();
  return {
    ...baseConfig,
    title: "Your Princess Personality Match",
    xAxis: {
      ...baseConfig.xAxis,
      label: "Damsel → Heroine"
    },
    yAxis: {
      ...baseConfig.yAxis,
      label: "Sweet → Fierce"
    }
  };
}

/**
 * Filter princesses by archetype quadrant
 * Useful for showing similar princesses to quiz results
 */
export function getPrincessesByQuadrant(
  feminismThreshold: number = 50,
  bitchinessThreshold: number = 50
) {
  const princesses = getAllPrincesses();
  
  return {
    independentWarriors: princesses.filter(p => 
      p.feminismPercentage >= feminismThreshold && p.bitchinessPercentage >= bitchinessThreshold
    ),
    gentleRevolutionaries: princesses.filter(p => 
      p.feminismPercentage >= feminismThreshold && p.bitchinessPercentage < bitchinessThreshold
    ),
    traditionalLeaders: princesses.filter(p => 
      p.feminismPercentage < feminismThreshold && p.bitchinessPercentage >= bitchinessThreshold
    ),
    sweethearts: princesses.filter(p => 
      p.feminismPercentage < feminismThreshold && p.bitchinessPercentage < bitchinessThreshold
    )
  };
}
