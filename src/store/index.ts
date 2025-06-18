import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import rotationReducer from './slices/rotationSlice';
import uiReducer from './slices/uiSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
    rotation: rotationReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;