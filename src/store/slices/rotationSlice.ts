import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Rotation, Period, PlayerAssignment, TimeSegment } from '../../types';

// Standard basketball game periods
const defaultPeriods: Period[] = [
  {
    id: uuidv4(),
    name: '1st Quarter',
    duration: 12 * 60, // 12 minutes in seconds
    startTime: 0,
    endTime: 12 * 60
  },
  {
    id: uuidv4(),
    name: '2nd Quarter',
    duration: 12 * 60,
    startTime: 12 * 60,
    endTime: 24 * 60
  },
  {
    id: uuidv4(),
    name: '3rd Quarter',
    duration: 12 * 60,
    startTime: 24 * 60,
    endTime: 36 * 60
  },
  {
    id: uuidv4(),
    name: '4th Quarter',
    duration: 12 * 60,
    startTime: 36 * 60,
    endTime: 48 * 60
  }
];

// Async thunks
export const fetchRotation = createAsyncThunk(
  'rotation/fetchRotation',
  async (rotationId: string) => {
    // In a real app, this would be an API call
    return new Promise<Rotation>((resolve) => {
      // Return empty rotation with default periods for now
      setTimeout(() => {
        resolve({
          id: rotationId || uuidv4(),
          gameId: uuidv4(),
          name: 'New Rotation',
          periods: defaultPeriods,
          playerAssignments: []
        });
      }, 500);
    });
  }
);

export const saveRotation = createAsyncThunk(
  'rotation/saveRotation',
  async (rotation: Rotation) => {
    // In a real app, this would be an API call
    return new Promise<Rotation>((resolve) => {
      setTimeout(() => resolve(rotation), 300);
    });
  }
);

export const generateOptimizedRotation = createAsyncThunk(
  'rotation/generateOptimizedRotation',
  async (playerIds: string[]) => {
    // In a real app, this would use an algorithm to generate an optimized rotation
    return new Promise<PlayerAssignment[]>((resolve) => {
      setTimeout(() => {
        // Create a simple staggered rotation for demo purposes
        const optimizedAssignments: PlayerAssignment[] = playerIds.map((playerId, index) => {
          const segments: TimeSegment[] = [];
          
          // First quarter
          if (index < 5) {
            segments.push({
              startTime: 0,
              endTime: 6 * 60,
              onCourt: true
            });
          }
          
          // Stagger substitutions throughout the game
          const staggerStart = (index % 5) * 3 * 60; // Stagger by 3 minute intervals
          
          segments.push({
            startTime: 12 * 60 + staggerStart,
            endTime: 18 * 60 + staggerStart,
            onCourt: true
          });
          
          segments.push({
            startTime: 24 * 60 + staggerStart,
            endTime: 30 * 60 + staggerStart,
            onCourt: true
          });
          
          // Last quarter - put starters back in
          if (index < 5) {
            segments.push({
              startTime: 36 * 60 + 6 * 60,
              endTime: 48 * 60,
              onCourt: true
            });
          }
          
          return {
            playerId,
            segments
          };
        });
        
        resolve(optimizedAssignments);
      }, 1000);
    });
  }
);

interface RotationState {
  current: Rotation | null;
  saved: Rotation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RotationState = {
  current: null,
  saved: [],
  status: 'idle',
  error: null
};

const rotationSlice = createSlice({
  name: 'rotation',
  initialState,
  reducers: {
    createNewRotation: (state) => {
      state.current = {
        id: uuidv4(),
        gameId: uuidv4(),
        name: 'New Rotation',
        periods: defaultPeriods,
        playerAssignments: []
      };
    },
    addPlayerAssignment: (state, action: PayloadAction<{ playerId: string }>) => {
      if (!state.current) return;
      
      // Check if player already has an assignment
      const existingIndex = state.current.playerAssignments.findIndex(
        pa => pa.playerId === action.payload.playerId
      );
      
      if (existingIndex === -1) {
        state.current.playerAssignments.push({
          playerId: action.payload.playerId,
          segments: []
        });
      }
    },
    removePlayerAssignment: (state, action: PayloadAction<string>) => {
      if (!state.current) return;
      
      state.current.playerAssignments = state.current.playerAssignments.filter(
        pa => pa.playerId !== action.payload
      );
    },
    addTimeSegment: (state, action: PayloadAction<{ 
      playerId: string, 
      segment: TimeSegment 
    }>) => {
      if (!state.current) return;
      
      const playerAssignment = state.current.playerAssignments.find(
        pa => pa.playerId === action.payload.playerId
      );
      
      if (playerAssignment) {
        playerAssignment.segments.push(action.payload.segment);
        // Sort segments by startTime
        playerAssignment.segments.sort((a, b) => a.startTime - b.startTime);
      }
    },
    updateTimeSegment: (state, action: PayloadAction<{
      playerId: string,
      segmentIndex: number,
      segment: TimeSegment
    }>) => {
      if (!state.current) return;
      
      const playerAssignment = state.current.playerAssignments.find(
        pa => pa.playerId === action.payload.playerId
      );
      
      if (playerAssignment && playerAssignment.segments[action.payload.segmentIndex]) {
        playerAssignment.segments[action.payload.segmentIndex] = action.payload.segment;
        // Sort segments by startTime
        playerAssignment.segments.sort((a, b) => a.startTime - b.startTime);
      }
    },
    removeTimeSegment: (state, action: PayloadAction<{
      playerId: string,
      segmentIndex: number
    }>) => {
      if (!state.current) return;
      
      const playerAssignment = state.current.playerAssignments.find(
        pa => pa.playerId === action.payload.playerId
      );
      
      if (playerAssignment) {
        playerAssignment.segments.splice(action.payload.segmentIndex, 1);
      }
    },
    updateRotationName: (state, action: PayloadAction<string>) => {
      if (state.current) {
        state.current.name = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRotation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRotation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchRotation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch rotation';
      })
      .addCase(saveRotation.fulfilled, (state, action) => {
        // Add to saved rotations if not already there
        const existingIndex = state.saved.findIndex(r => r.id === action.payload.id);
        if (existingIndex !== -1) {
          state.saved[existingIndex] = action.payload;
        } else {
          state.saved.push(action.payload);
        }
        
        // Update current rotation
        if (state.current?.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(generateOptimizedRotation.fulfilled, (state, action) => {
        if (state.current) {
          state.current.playerAssignments = action.payload;
        }
      });
  }
});

export const {
  createNewRotation,
  addPlayerAssignment,
  removePlayerAssignment,
  addTimeSegment,
  updateTimeSegment,
  removeTimeSegment,
  updateRotationName
} = rotationSlice.actions;

export default rotationSlice.reducer;