export interface Princess {
  id: string;                    // Unique identifier (kebab-case name)
  name: string;                  // Display name
  source: string;                // Source material (movie/anime title)
  heroineScore: number;          // 0-100, represents X-axis position (formerly feminismPercentage)
  bitchScore: number;            // 0-100, represents Y-axis position (formerly bitchinessPercentage)
  description: string;           // Sassy personality description from reveal data
  imageUrl: string;              // Princess image URL
  personalityMessage: string;    // Generated message based on trait combination
}

export interface PrincessData {
  version: string;
  lastUpdated: string;
  princesses: Princess[];
  metadata: {
    totalCount: number;
    dataSource: string;
    generator: string;
  };
}

export interface GraphConfig {
  title: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  plotArea: PlotAreaConfig;
  styling: GraphStyling;
}

export interface AxisConfig {
  label: string;
  min: number;
  max: number;
  tickInterval: number;
}

export interface PlotAreaConfig {
  backgroundColor: string;
  gridLineColor: string;
  showGrid: boolean;
}

export interface GraphStyling {
  selectedPrincess: {
    color: string;
    size: number;
    borderWidth: number;
  };
  unselectedPrincess: {
    color: string;
    size: number;
    opacity: number;
  };
  hoverEffect: {
    scale: number;
    borderColor: string;
  };
}

export interface SelectionState {
  selectedPrincessId: string | null;
  fromPage: 'index' | 'result';
  timestamp: number;
}
