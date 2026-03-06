import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/breeds'; 
// Асинхронный thunk для загрузки пород
export const fetchBreeds = createAsyncThunk('breeds/fetchBreeds', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});


// Асинхронный thunk для добавления породы
export const addBreed = createAsyncThunk(
    'breeds/addBreed',
    async (newBreed, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found. Redirecting to login...');
            window.location.href = '/login'; // Перенаправляем пользователя на страницу входа
            return rejectWithValue({ message: 'Token not found' });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.post(API_URL, newBreed, config);
            return response.data;
        } catch (error) {
            console.error('Error adding breed:', error);
            return rejectWithValue(error.response?.data || { message: 'Failed to add breed' });
        }
    }
);
// Асинхронный thunk для обновления породы
export const updateBreed = createAsyncThunk(
    
    'breeds/updateBreed',
    async ({ id, updatedData }, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found. Redirecting to login...');
            window.location.href = '/login';
            return rejectWithValue({ message: 'Token not found' });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedData, config);
            return response.data;
        } catch (error) {
            console.error('Error updating breed:', error);
            return rejectWithValue(error.response?.data || { message: 'Failed to update breed' });
        }
    }
);
// Асинхронный thunk для удаления породы
export const deleteBreed = createAsyncThunk(
    'breeds/deleteBreed',
    async (id, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found. Redirecting to login...');
            window.location.href = '/login';
            return rejectWithValue({ message: 'Token not found' });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.delete(`${API_URL}/${id}`, config);
            return id;
        } catch (error) {
            console.error('Error deleting breed:', error);
            return rejectWithValue(error.response?.data || { message: 'Failed to delete breed' });
        }
    }
);
const breedsSlice = createSlice({
    name: 'breeds',
    initialState: {
        list: [],
        status: 'idle', 
        error: null,
    },
    
    reducers: {},
    extraReducers: (builder) => {
        
        builder
            // Fetch breeds
            .addCase(fetchBreeds.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBreeds.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchBreeds.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Add breed
            .addCase(addBreed.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })

            // Update breed
            .addCase(updateBreed.fulfilled, (state, action) => {
                const updatedBreed = action.payload;
                const index = state.list.findIndex((breed) => breed.id === updatedBreed.id);
                if (index !== -1) {
                    state.list[index] = updatedBreed;
                }
            })

            // Delete breed
            .addCase(deleteBreed.fulfilled, (state, action) => {
                const id = action.payload;
                state.list = state.list.filter((breed) => breed.id !== id);
            });
    },
});


export default breedsSlice.reducer;
