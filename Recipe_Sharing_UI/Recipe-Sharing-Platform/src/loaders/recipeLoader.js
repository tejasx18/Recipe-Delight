import recipeStore from "../store";
import { fetchFeaturedRecipe } from "../store/featuredRecipeSlice";
import { fetchUserData } from "../store/userDataSlice";

export const fetchFeaturedRecipeLoader = () => {
  return recipeStore.dispatch(fetchFeaturedRecipe());
};

export const fetchUserDataLoader = () => {
  return recipeStore.dispatch(fetchUserData());
};



