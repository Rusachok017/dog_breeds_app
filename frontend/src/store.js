import { configureStore } from '@reduxjs/toolkit';
import breedsReducer from './features/breedsSlice';

export const store = configureStore({
    reducer: {
        breeds: breedsReducer,
    },
});