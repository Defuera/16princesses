export interface Princess {
  id: string;                    // Unique identifier (kebab-case name)
  name: string;                  // Display name
  source: string;                // Source material (movie/anime title)
  feminismPercentage: number;    // 0-100, represents X-axis position
  bitchinessPercentage: number;  // 0-100, represents Y-axis position  
  personalityMessage: string;    // Generated message based on trait combination
  imageUrl?: string;             // Optional princess image path
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
