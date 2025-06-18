# Architecture - Basketball Rotation Manager

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                                                                 │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Roster        │  │ Rotation       │  │ Analytics         │  │
│  │ Management    │  │ Timeline       │  │ Dashboard         │  │
│  └───────────────┘  └────────────────┘  └───────────────────┘  │
└───────────┬─────────────────┬──────────────────┬───────────────┘
            │                 │                  │
┌───────────▼─────────────────▼──────────────────▼───────────────┐
│                    Application Core Logic                       │
│                                                                 │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Player        │  │ Rotation       │  │ Optimization      │  │
│  │ Service       │  │ Engine         │  │ Engine            │  │
│  └───────────────┘  └────────────────┘  └───────────────────┘  │
└───────────┬─────────────────┬──────────────────┬───────────────┘
            │                 │                  │
┌───────────▼─────────────────▼──────────────────▼───────────────┐
│                         Data Layer                              │
│                                                                 │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Player        │  │ Game           │  │ Performance       │  │
│  │ Data Store    │  │ Templates      │  │ Statistics        │  │
│  └───────────────┘  └────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Structure

### Frontend Components

#### Roster Management
- `PlayerList`: Displays all players on the roster
- `PlayerCard`: Shows individual player information
- `PlayerEditor`: Interface for adding/editing player details
- `PositionFilter`: Filters players by position

#### Rotation Timeline
- `TimelineCanvas`: Main visualization area for rotations
- `QuarterDivider`: Separates game into quarters/periods
- `PlayerRow`: Represents a player's minutes on the timeline
- `SubstitutionMarker`: Indicates player substitution points
- `FatigueIndicator`: Visual representation of player fatigue

#### Analytics Dashboard
- `MinutesDistribution`: Chart showing minutes by player/position
- `LineupEvaluator`: Analysis of different lineup combinations
- `FatigueTracker`: Graph of player fatigue throughout the game
- `PerformanceCorrelation`: Links minutes to performance metrics

### Core Logic

#### Player Service
- Player data management
- Position optimization
- Player compatibility analysis

#### Rotation Engine
- Timeline data management
- Substitution pattern logic
- Rule enforcement (min/max minutes, rest periods)

#### Optimization Engine
- Fatigue modeling algorithms
- Lineup effectiveness calculations
- Substitution recommendation generation

### Data Models

#### Player
```typescript
interface Player {
  id: string;
  name: string;
  number: number;
  position: Position | Position[];
  minutes: {
    target: number;    // Target minutes per game
    max: number;       // Maximum minutes per game
    consecutive: number; // Maximum consecutive minutes
  };
  skills: Skill[];
  stats?: PerformanceStats;
}
```

#### Rotation
```typescript
interface Rotation {
  id: string;
  gameId: string;
  periods: Period[];
  playerAssignments: PlayerAssignment[];
}

interface Period {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

interface PlayerAssignment {
  playerId: string;
  segments: TimeSegment[];
}

interface TimeSegment {
  startTime: number;
  endTime: number;
  onCourt: boolean;
}
```

## State Management

The application uses Redux with Redux Toolkit for state management:

### Redux Slices
- `playersSlice`: Manages the roster of players
- `rotationSlice`: Handles the current rotation plan
- `uiSlice`: Controls UI state (active views, selected players)
- `analyticsSlice`: Stores derived analytics data

### Async Actions
- `fetchRoster`: Loads player data
- `saveRotation`: Persists rotation plan
- `generateOptimizedRotation`: Creates an AI-optimized rotation plan

## Data Flow

1. User creates/loads a roster of players with details
2. User designs rotation on the interactive timeline
3. Application calculates fatigue and provides suggestions
4. User adjusts rotation based on insights
5. Final rotation plan can be saved as a template or exported

## External Interfaces

### Local Storage
- Saves player roster
- Stores game templates
- Preserves user preferences

### Export Formats
- PDF for printable rotation charts
- CSV for data analysis
- JSON for application data backup

## Responsive Design

The application uses responsive design principles to work across devices:
- Desktop: Full-featured interface with detailed analytics
- Tablet: Focused on rotation management with simplified views
- Mobile: Essential features for on-bench quick reference