import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


export const fetchFavouriteRecipe = createAsyncThunk(
  'favouriteRecipes/fetchFavouriteRecipe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/favouriteRecipe/', {
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
  "favouriteRecipes/toggleFavoriteRecipe",
  async (recipe_id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/favouriteRecipe/toggle`, 
        { recipe_id: recipe_id ,
          recipe_add: false,
        }, 
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

const favouriteRecipeSlice = createSlice({
  name: 'favouriteRecipes',
  initialState:{
    recipes: [],
    status: 'idle',
    error: null,
    toggleStatus: 'idle', 
    toggleError: null,    
  },
  reducers:{
    toggleFavorite : (state,action) => {
      const recipe = action.payload;
      if(recipe.is_favorite){
        state.recipes.unshift(recipe);
      }
      else{
        const index = state.recipes.findIndex(r => r.recipe_id === recipe.recipe_id);
        if (index !== -1) {
          state.recipes.splice(index, 1);
        }
      }
    },
    changeStatus : (state) => {
      state.status='idle';
    },
    updateRecipeRating : (state,action) => {
      const { recipe_id , rating } = action.payload;
      const stateRecipe = state.recipes.find((recipe)=> recipe.recipe_id === recipe_id);
      if(stateRecipe){
        stateRecipe.user_rating = rating;
        state.status='idle';
      }
    },
    updateRecipeComment : (state,action) => {
      const { recipe_id , comment } = action.payload;
      const stateRecipe = state.recipes.find((recipe)=> recipe.recipe_id === recipe_id);
      if(stateRecipe){
        if (!Array.isArray(stateRecipe.comments)) {
          stateRecipe.comments = [];
        }
        stateRecipe.comments.push(comment);
        state.status='idle';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavouriteRecipe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavouriteRecipe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recipes = action.payload;
      })
      .addCase(fetchFavouriteRecipe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(toggleFavoriteRecipe.pending, (state) => {
        state.toggleStatus = 'loading';
      })
      .addCase(toggleFavoriteRecipe.fulfilled, (state, action) => {
        state.toggleStatus = 'succeeded';
        const updatedRecipe_id = action.payload.recipe_id;
        state.recipes = state.recipes.filter(recipe => recipe.recipe_id !== updatedRecipe_id);
      })
      .addCase(toggleFavoriteRecipe.rejected, (state, action) => {
        state.toggleStatus = 'failed';
        state.toggleError = action.payload.message || action.error.message;
      });
  },
});

export const favouriteRecipeActions = favouriteRecipeSlice.actions;

export default favouriteRecipeSlice.reducer;