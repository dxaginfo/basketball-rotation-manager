import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedPlayerId: string | null;
  selectedSegmentId: string | null;
  activeView: 'roster' | 'rotation' | 'analytics' | 'settings';
  draggingItemId: string | null;
  zoomLevel: number;
  showFatigueIndicators: boolean;
  showRecommendations: boolean;
  timelineScroll: number;
}

const initialState: UiState = {
  selectedPlayerId: null,
  selectedSegmentId: null,
  activeView: 'roster',
  draggingItemId: null,
  zoomLevel: 1,
  showFatigueIndicators: true,
  showRecommendations: true,
  timelineScroll: 0
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectPlayer: (state, action: PayloadAction<string | null>) => {
      state.selectedPlayerId = action.payload;
      state.selectedSegmentId = null;
    },
    selectSegment: (state, action: PayloadAction<string | null>) => {
      state.selectedSegmentId = action.payload;
    },
    setActiveView: (state, action: PayloadAction<UiState['activeView']>) => {
      state.activeView = action.payload;
    },
    setDraggingItem: (state, action: PayloadAction<string | null>) => {
      state.draggingItemId = action.payload;
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = Math.max(0.5, Math.min(2, action.payload)); // Clamp between 0.5 and 2
    },
    toggleFatigueIndicators: (state) => {
      state.showFatigueIndicators = !state.showFatigueIndicators;
    },
    toggleRecommendations: (state) => {
      state.showRecommendations = !state.showRecommendations;
    },
    setTimelineScroll: (state, action: PayloadAction<number>) => {
      state.timelineScroll = action.payload;
    },
    resetUiState: (state) => {
      return initialState;
    }
  }
});

export const {
  selectPlayer,
  selectSegment,
  setActiveView,
  setDraggingItem,
  setZoomLevel,
  toggleFatigueIndicators,
  toggleRecommendations,
  setTimelineScroll,
  resetUiState
} = uiSlice.actions;

export default uiSlice.reducer;