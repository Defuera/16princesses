# Data Model: 16Princesses Test

**Feature**: 16Princesses Test (Interactive Princess Personality Website)
**Phase**: 1 - Design & Contracts
**Date**: 2025-09-27

## Entity Definitions

### Princess Entity
Core data structure representing a princess character with personality traits.

```typescript
interface Princess {
  id: string;                    // Unique identifier (kebab-case name)
  name: string;                  // Display name
  source: string;                // Source material (movie/anime title)
  feminismPercentage: number;    // 0-100, represents X-axis position
  bitchinessPercentage: number;  // 0-100, represents Y-axis position  
  personalityMessage: string;    // Generated message based on trait combination
  imageUrl?: string;             // Optional princess image path
}
```

**Validation Rules**:
- `id`: Required, unique, lowercase with hyphens (e.g., "snow-white")
- `name`: Required, 1-50 characters
- `source`: Required, 1-100 characters
- `feminismPercentage`: Required, integer 0-100
- `bitchinessPercentage`: Required, integer 0-100
- `personalityMessage`: Required, 1-200 characters
- `imageUrl`: Optional, valid relative path

**Data Source**: Generated from `/GRAPH.md` via conversion script

### Graph Configuration Entity
Configuration for the scatter plot visualization.

```typescript
interface GraphConfig {
  title: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  plotArea: PlotAreaConfig;
  styling: GraphStyling;
}

interface AxisConfig {
  label: string;
  min: number;
  max: number;
  tickInterval: number;
}

interface PlotAreaConfig {
  backgroundColor: string;
  gridLineColor: string;
  showGrid: boolean;
}

interface GraphStyling {
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
```

**Default Values**:
```json
{
  "title": "16Princesses Test - Your Princess Archetype",
  "xAxis": {
    "label": "Patriarchal → Feminist",
    "min": 0,
    "max": 100,
    "tickInterval": 25
  },
  "yAxis": {
    "label": "Sweet → Assertive",
    "min": 0,
    "max": 100,
    "tickInterval": 25
  },
  "plotArea": {
    "backgroundColor": "#fafafa",
    "gridLineColor": "#e0e0e0",
    "showGrid": true
  }
}
```

### User Selection State
Represents the current user's princess selection and navigation state.

```typescript
interface SelectionState {
  selectedPrincessId: string | null;
  fromPage: 'index' | 'result';
  timestamp: number;
}
```

**State Management**:
- URL Parameter: `?princess={id}` for result page
- Session Storage: Temporary navigation state
- No persistent storage (privacy-focused)

## Data Relationships

### Princess ↔ Graph Positioning
```
Princess.feminismPercentage → Graph X-coordinate (0-100 scale)
Princess.bitchinessPercentage → Graph Y-coordinate (0-100 scale)  
Princess.personalityMessage ← Generated from coordinate quadrant
```

### Selection ↔ Display Logic
```
User Selection → URL Parameter → Princess Lookup → Graph Highlight + Message Display
```

## Data Processing Pipeline

### 1. Source Data Conversion
```
GRAPH.md (markdown table)
  ↓ [Conversion Script]
princesses.json (structured data)
  ↓ [Runtime Processing]  
Princess[] (JavaScript objects)
```

### 2. Message Generation Algorithm
```typescript
function generatePersonalityMessage(feminism: number, bitchiness: number): string {
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
```

### 3. Graph Data Transformation
```typescript
function transformForChart(princesses: Princess[]): ChartDataset {
  return {
    data: princesses.map(p => ({
      x: p.feminismPercentage,
      y: p.bitchinessPercentage,
      label: p.name,
      princess: p  // Attach full princess object for tooltips
    }))
  };
}
```

## Data Validation

### Input Validation Rules
- All percentage values must be integers 0-100
- Princess names must be unique within dataset
- Source materials must be properly attributed
- Generated messages must be family-friendly and positive

### Data Integrity Checks
- Verify 16 princesses total (matching GRAPH.md)
- Ensure no duplicate coordinates (handle overlaps)
- Validate all required fields present
- Check message generation covers all quadrants

## Storage and Access Patterns

### Static Data File Structure
```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-09-27",
  "princesses": [
    {
      "id": "snow-white",
      "name": "Snow White",
      "source": "Snow White and the Seven Dwarfs",
      "feminismPercentage": 5,
      "bitchinessPercentage": 5,
      "personalityMessage": "You're such a sweetheart! 💖"
    }
    // ... remaining 15 princesses
  ],
  "metadata": {
    "totalCount": 16,
    "dataSource": "GRAPH.md",
    "generator": "conversion-script v1.0"
  }
}
```

### Access Patterns
- **Princess List Page**: Load all princesses, display names/sources only
- **Result Page**: Load selected princess by ID, display full data + graph
- **Graph Rendering**: Transform all princesses to chart coordinates
- **Message Display**: Show personality message for selected princess

## Performance Considerations

### Data Size Optimization
- Estimated JSON size: ~3-4KB (16 princesses × ~200 bytes each)
- Lazy load images (optional enhancement)
- Minimize data structure nesting

### Caching Strategy  
- Static JSON cached aggressively by browser
- Chart.js library cached separately
- No dynamic data invalidation needed

## Error Handling

### Data Loading Errors
```typescript
enum DataError {
  FETCH_FAILED = 'Failed to load princess data',
  INVALID_FORMAT = 'Princess data format invalid',
  MISSING_PRINCESS = 'Selected princess not found',
  CALCULATION_ERROR = 'Graph positioning calculation failed'
}
```

### Fallback Strategies
- Display error message if data fails to load
- Default to Snow White if selected princess not found
- Show basic list if graph rendering fails
- Graceful degradation for missing images

**Data Model Phase Complete** ✅
