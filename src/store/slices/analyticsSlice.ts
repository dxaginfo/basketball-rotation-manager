import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FatigueModel, LineupEffectiveness, MinutesDistribution } from '../../types';
import { RootState } from '../index';

// Async thunks
export const calculateFatigueModels = createAsyncThunk(
  'analytics/calculateFatigueModels',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { current } = state.rotation;
    const { items: players } = state.players;
    
    if (!current) return [];
    
    // In a real app, this would use a sophisticated algorithm
    // For demo, we'll create a simple fatigue model based on minutes played
    return new Promise<FatigueModel[]>((resolve) => {
      setTimeout(() => {
        const fatigueModels: FatigueModel[] = current.playerAssignments.map(pa => {
          const player = players.find(p => p.id === pa.playerId);
          const timestamps: number[] = [];
          const fatigueValues: number[] = [];
          
          // Calculate timestamps and fatigue values at intervals
          for (let time = 0; time < 48 * 60; time += 60) { // Check every minute
            timestamps.push(time);
            
            // Calculate if player is on court at this time
            const onCourt = pa.segments.some(seg => 
              seg.startTime <= time && seg.endTime >= time && seg.onCourt
            );
            
            // Simple fatigue model:
            // - Fatigue builds while on court
            // - Fatigue reduces while off court
            // - Rate depends on player's max consecutive minutes
            const prevFatigue = fatigueValues.length > 0 
              ? fatigueValues[fatigueValues.length - 1] 
              : 0;
            
            const maxConsecutive = player?.minutes.consecutive || 5;
            const fatigueRate = onCourt ? (100 / (maxConsecutive * 60)) : -0.05;
            
            let newFatigue = prevFatigue + fatigueRate;
            // Clamp fatigue between 0 and 100
            newFatigue = Math.max(0, Math.min(100, newFatigue));
            
            fatigueValues.push(newFatigue);
          }
          
          return {
            playerId: pa.playerId,
            timestamps,
            fatigueValues
          };
        });
        
        resolve(fatigueModels);
      }, 500);
    });
  }
);

export const calculateMinutesDistribution = createAsyncThunk(
  'analytics/calculateMinutesDistribution',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { current } = state.rotation;
    
    if (!current) return [];
    
    return new Promise<MinutesDistribution[]>((resolve) => {
      setTimeout(() => {
        const minutesDistributions: MinutesDistribution[] = current.playerAssignments.map(pa => {
          // Initialize minutes by period
          const minutesByPeriod: Record<string, number> = {};
          current.periods.forEach(period => {
            minutesByPeriod[period.id] = 0;
          });
          
          // Calculate minutes for each segment
          let totalMinutes = 0;
          pa.segments.forEach(segment => {
            if (segment.onCourt) {
              const durationMinutes = (segment.endTime - segment.startTime) / 60;
              totalMinutes += durationMinutes;
              
              // Determine which period(s) this segment belongs to
              current.periods.forEach(period => {
                // Calculate overlap between segment and period
                const overlapStart = Math.max(segment.startTime, period.startTime);
                const overlapEnd = Math.min(segment.endTime, period.endTime);
                
                if (overlapEnd > overlapStart) {
                  const overlapMinutes = (overlapEnd - overlapStart) / 60;
                  minutesByPeriod[period.id] += overlapMinutes;
                }
              });
            }
          });
          
          return {
            playerId: pa.playerId,
            totalMinutes,
            minutesByPeriod
          };
        });
        
        resolve(minutesDistributions);
      }, 300);
    });
  }
);

export const evaluateLineupEffectiveness = createAsyncThunk(
  'analytics/evaluateLineupEffectiveness',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { current } = state.rotation;
    const { items: players } = state.players;
    
    if (!current) return [];
    
    // In a real app, this would analyze real data
    // For demo, we'll generate some simulated lineup effectiveness data
    return new Promise<LineupEffectiveness[]>((resolve) => {
      setTimeout(() => {
        // Find all time points where the lineup changes
        const allSegments = current.playerAssignments.flatMap(pa => 
          pa.segments.map(seg => ({
            playerId: pa.playerId,
            startTime: seg.startTime,
            endTime: seg.endTime,
            onCourt: seg.onCourt
          }))
        );
        
        // Sort all time points
        const allTimePoints = [...new Set([
          ...allSegments.map(seg => seg.startTime),
          ...allSegments.map(seg => seg.endTime)
        ])].sort((a, b) => a - b);
        
        // Generate lineups for each time slice
        const lineups: LineupEffectiveness[] = [];
        
        for (let i = 0; i < allTimePoints.length - 1; i++) {
          const startTime = allTimePoints[i];
          const endTime = allTimePoints[i + 1];
          
          if (endTime - startTime < 60) continue; // Skip very short segments
          
          // Find players on court during this time slice
          const playersOnCourt = current.playerAssignments
            .filter(pa => pa.segments.some(
              seg => seg.startTime <= startTime && seg.endTime >= endTime && seg.onCourt
            ))
            .map(pa => pa.playerId);
          
          if (playersOnCourt.length === 5) { // Only evaluate valid 5-player lineups
            const playerSkills = playersOnCourt.flatMap(id => {
              const player = players.find(p => p.id === id);
              return player?.skills || [];
            });
            
            // Simple effectiveness calculation based on skill distribution
            const uniqueSkills = [...new Set(playerSkills)].length;
            const skillVariety = uniqueSkills / playerSkills.length;
            
            // Generate some plausible ratings based on skill variety
            const baseOffensive = 80 + Math.random() * 20;
            const baseDefensive = 80 + Math.random() * 20;
            
            const offensiveRating = baseOffensive * (0.8 + skillVariety * 0.4);
            const defensiveRating = baseDefensive * (0.8 + skillVariety * 0.4);
            const plusMinus = ((offensiveRating - defensiveRating) / 10) - 5;
            
            lineups.push({
              players: playersOnCourt,
              offensiveRating,
              defensiveRating,
              plusMinus
            });
          }
        }
        
        resolve(lineups);
      }, 800);
    });
  }
);

interface AnalyticsState {
  fatigueModels: FatigueModel[];
  minutesDistribution: MinutesDistribution[];
  lineupEffectiveness: LineupEffectiveness[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnalyticsState = {
  fatigueModels: [],
  minutesDistribution: [],
  lineupEffectiveness: [],
  status: 'idle',
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.fatigueModels = [];
      state.minutesDistribution = [];
      state.lineupEffectiveness = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Calculate Fatigue Models
      .addCase(calculateFatigueModels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateFatigueModels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fatigueModels = action.payload;
      })
      .addCase(calculateFatigueModels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to calculate fatigue models';
      })
      
      // Calculate Minutes Distribution
      .addCase(calculateMinutesDistribution.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateMinutesDistribution.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.minutesDistribution = action.payload;
      })
      .addCase(calculateMinutesDistribution.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to calculate minutes distribution';
      })
      
      // Evaluate Lineup Effectiveness
      .addCase(evaluateLineupEffectiveness.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(evaluateLineupEffectiveness.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lineupEffectiveness = action.payload;
      })
      .addCase(evaluateLineupEffectiveness.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to evaluate lineup effectiveness';
      });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;