import {configureStore , combineReducers} from "@reduxjs/toolkit";
import featuredRecipeReducer from "./featuredRecipeSlice";
import submittedRecipeReducer from "./submittedRecipeSlice";
import favouriteRecipeReducer from "./favouriteRecipeSlice";
import categoryRecipeReducer from "./categoryRecipeSlice";


const appReducer = combineReducers({
  featuredRecipes: featuredRecipeReducer,
  submittedRecipes: submittedRecipeReducer,
  favouriteRecipes: favouriteRecipeReducer,
  categoryRecipes: categoryRecipeReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined;
  }
  return appReducer(state, action);
};

const recipeStore = configureStore({
  reducer: rootReducer,
});

export const logout = () => ({ type: 'RESET_ALL' });
export default recipeStore;