import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFeaturedRecipe = createAsyncThunk(
  'featuredRecipes/fetchFeaturedRecipe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/featuredRecipe/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 
      return response.data;
    } catch (error) {
       return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const toggleFavoriteRecipe = createAsyncThunk(
  "featuredRecipes/toggleFavoriteRecipe",
  async ({ recipe_id, is_favorite }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/favouriteRecipe/toggle`, 
        { recipe_id, recipe_add: is_favorite }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


const featuredRecipeSlice = createSlice({
  name: 'featuredRecipes',
  initialState: {
    recipes: [],
    status: 'idle',
    error: null,
    toggleStatus: 'idle', 
    toggleError: null,
  },
  reducers: {
    toggleFavorite : (state,action) => {
      const { recipe_id , is_favorite } = action.payload;
      const stateRecipe = state.recipes.find((recipe)=> recipe.recipe_id === recipe_id);
      if(stateRecipe){
        stateRecipe.is_favorite = is_favorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedRecipe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedRecipe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = action.payload;
      })
      .addCase(fetchFeaturedRecipe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(toggleFavoriteRecipe.pending, (state) => {
        state.toggleStatus = 'loading';
      })
      .addCase(toggleFavoriteRecipe.fulfilled, (state, action) => {
        state.toggleStatus = 'succeeded';
        const updatedRecipe_id = action.payload.recipe_id;
        const is_favorite = action.payload.is_favorite;
        const  index = state.recipes.findIndex((recipe)=>recipe.recipe_id === updatedRecipe_id);
        if(index !== -1){
          state.recipes[index].is_favorite = is_favorite;
        }
        else{
          state.toggleStatus = 'failed';
          state.toggleError = "Unable to update favorite status: Recipe not found.";
        }
      })
      .addCase(toggleFavoriteRecipe.rejected, (state, action) => {
        state.toggleStatus = 'failed';
        state.toggleError = action.payload.message || action.error.message;
      });
  },
});

export const featuredRecipesActions = featuredRecipeSlice.actions;

export default featuredRecipeSlice.reducer;

