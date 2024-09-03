import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeaturedRecipe,
  toggleFavoriteRecipe,
} from "../store/featuredRecipeSlice";
import { submittedRecipeActions } from "../store/submittedRecipeSlice";
import { favouriteRecipeActions } from "../store/favouriteRecipeSlice";
import { categoryRecipesActions } from "../store/categoryRecipeSlice";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Recipe from "./Recipe";

const Home = () => {
  const dispatch = useDispatch();
  const {
    recipes = [],
    status = "idle",
    error = null,
    toggleStatus,
    toggleError,
  } = useSelector((state) => state.featuredRecipes);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFeaturedRecipe());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (toggleStatus === "failed") {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [toggleStatus]);
  if (status === "loading") {
    return <Loader />;
  }

  if (status === "failed") {
    return <Error message={error} />;
  }

  if (recipes.length === 0) {
    return <Error message="Favourite list is Empty!" />;
  }

  function onFavoriteToggle(recipe) {
    const updatedRecipe = { ...recipe, is_favorite: !recipe.is_favorite };
    console.log(updatedRecipe.is_favorite);
    dispatch(
      toggleFavoriteRecipe({
        recipe_id: updatedRecipe.recipe_id,
        is_favorite: updatedRecipe.is_favorite,
      })
    )
      .then(() => {
        console.log("component");
        dispatch(
          submittedRecipeActions.toggleFavorite({
            recipe_id: updatedRecipe.recipe_id,
            is_favorite: updatedRecipe.is_favorite,
          })
        );
      })
      .then(() => {
        dispatch(favouriteRecipeActions.toggleFavorite(updatedRecipe));
      })
      .then(() => {
        dispatch(categoryRecipesActions.toggleFavorite({ recipe_id  : updatedRecipe.recipe_id, is_favorite : updatedRecipe.is_favorite }));
      });
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          bgcolor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 32, color: "#673ab7", mr: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Featured Recipes
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        {toggleStatus === "loading" && <CircularProgress color="inherit" />}
        {showAlert && toggleStatus === "failed" && (
          <Alert severity="error">{toggleError}</Alert>
        )}
      </Box>
      <Grid container spacing={3} px={2}>
        {recipes.map((recipe, index) => (
          <Recipe
            key={index}
            recipe={recipe}
            handleFavoriteToggle={onFavoriteToggle}
            toggleStatus={toggleStatus}
          />
        ))}
      </Grid>
    </>
  );
};

export default Home;
