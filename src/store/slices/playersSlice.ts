import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Player, Position, Skill } from '../../types';

// Sample initial data
const samplePlayers: Player[] = [
  {
    id: uuidv4(),
    name: 'John Smith',
    number: 1,
    position: Position.PG,
    minutes: {
      target: 30,
      max: 36,
      consecutive: 8
    },
    skills: [Skill.PLAYMAKER, Skill.DEFENDER]
  },
  {
    id: uuidv4(),
    name: 'Mike Johnson',
    number: 2,
    position: Position.SG,
    minutes: {
      target: 28,
      max: 32,
      consecutive: 7
    },
    skills: [Skill.SHOOTER, Skill.FINISHER]
  },
  {
    id: uuidv4(),
    name: 'Dave Williams',
    number: 3,
    position: Position.SF,
    minutes: {
      target: 24,
      max: 30,
      consecutive: 8
    },
    skills: [Skill.VERSATILE, Skill.DEFENDER]
  },
  {
    id: uuidv4(),
    name: 'James Brown',
    number: 4,
    position: Position.PF,
    minutes: {
      target: 26,
      max: 32,
      consecutive: 7
    },
    skills: [Skill.REBOUNDER, Skill.FINISHER]
  },
  {
    id: uuidv4(),
    name: 'Robert Davis',
    number: 5,
    position: Position.C,
    minutes: {
      target: 24,
      max: 28,
      consecutive: 6
    },
    skills: [Skill.REBOUNDER, Skill.DEFENDER]
  }
];

// Async thunks
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async () => {
    // In a real app, this would be an API call
    // For now, we'll just return the sample data
    return new Promise<Player[]>((resolve) => {
      setTimeout(() => resolve(samplePlayers), 500);
    });
  }
);

export const savePlayer = createAsyncThunk(
  'players/savePlayer',
  async (player: Player) => {
    // In a real app, this would be an API call
    // For now, we'll just return the player
    return new Promise<Player>((resolve) => {
      setTimeout(() => resolve(player), 300);
    });
  }
);

interface PlayersState {
  items: Player[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PlayersState = {
  items: [],
  status: 'idle',
  error: null
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Omit<Player, 'id'>>) => {
      const newPlayer = {
        ...action.payload,
        id: uuidv4()
      };
      state.items.push(newPlayer);
    },
    updatePlayer: (state, action: PayloadAction<Player>) => {
      const index = state.items.findIndex(player => player.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(player => player.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch players';
      })
      .addCase(savePlayer.fulfilled, (state, action) => {
        const index = state.items.findIndex(player => player.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      });
  }
});

export const { addPlayer, updatePlayer, removePlayer } = playersSlice.actions;
export default playersSlice.reducer;