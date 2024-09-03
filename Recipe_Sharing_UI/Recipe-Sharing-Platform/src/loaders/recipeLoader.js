import recipeStore from "../store";
import { fetchFeaturedRecipe } from "../store/featuredRecipeSlice";


export const fetchFeaturedRecipeLoader = () => {
  return recipeStore.dispatch(fetchFeaturedRecipe());
};

