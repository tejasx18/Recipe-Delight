import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmittedRecipe , toggleFavoriteRecipe } from "../store/submittedRecipeSlice";
import { favouriteRecipeActions } from "../store/favouriteRecipeSlice";
import { featuredRecipesActions } from "../store/featuredRecipeSlice";
import { categoryRecipesActions } from "../store/categoryRecipeSlice";
import recipeStore from "../store";
import Loader from "./Loader";
import Error from "./Error";
import { Alert, Box, CircularProgress, Grid } from "@mui/material";
import Recipe from "./Recipe";


const SubmittedRecipe = () =>{
  const dispatch = useDispatch();
  const { recipes = [], status = 'idle', error = null , toggleStatus, toggleError} = useSelector( (state) => state.submittedRecipes );
  const [showAlert, setShowAlert] = useState(false);

  useEffect(()=>{
    if(status === 'idle'){
      recipeStore.dispatch(fetchSubmittedRecipe());
    }
  },
  [dispatch,status]);

  useEffect(() => {
    if (toggleStatus === 'failed') {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [toggleStatus]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed') {
    
    return <Error  message={error} />;
  }

  if (recipes.length === 0) {
    return <Error message="Favourite list is Empty!" />;
  }

  function onFavoriteToggle(recipe) {
    const updatedRecipe = { ...recipe, is_favorite: !recipe.is_favorite };
    dispatch(toggleFavoriteRecipe({ recipe_id  : updatedRecipe.recipe_id, is_favorite : updatedRecipe.is_favorite }))
      .then(() => {
        dispatch(favouriteRecipeActions.toggleFavorite(updatedRecipe));
      })
      .then(() => {
        dispatch(featuredRecipesActions.toggleFavorite({ recipe_id  : updatedRecipe.recipe_id, is_favorite : updatedRecipe.is_favorite }));
      })
      .then(() => {
        dispatch(categoryRecipesActions.toggleFavorite({ recipe_id  : updatedRecipe.recipe_id, is_favorite : updatedRecipe.is_favorite }));
      });
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        {toggleStatus === 'loading' && (
            <CircularProgress color="inherit" />
        )}
        {showAlert && toggleStatus === 'failed' && (
            <Alert severity="error">{toggleError}</Alert> 
        )}
        </Box>
      <Grid container spacing={3} px={2}>
        {recipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} handleFavoriteToggle={onFavoriteToggle} />
        ))}
      </Grid>
    </>
  );
}

export default SubmittedRecipe;