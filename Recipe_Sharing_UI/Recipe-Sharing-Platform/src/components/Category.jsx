import { Alert, Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryRecipe , toggleFavoriteRecipe } from "../store/categoryRecipeSlice";
import { submittedRecipeActions } from "../store/submittedRecipeSlice";
import { favouriteRecipeActions } from "../store/favouriteRecipeSlice";
import { featuredRecipesActions } from "../store/featuredRecipeSlice";
import Loader from "./Loader";
import Error from "./Error";
import Recipe from "./Recipe";


const Category = () => {
  const [{category , tag}, setState] =useState({
    category: '',
    tag:'',
  });
 
  const dispatch = useDispatch();
  const { recipes = [], status = 'idle', error = null ,toggleStatus, toggleError } = useSelector((state) => state.categoryRecipes );
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    if (category !== '' || tag !== '') {
      dispatch(fetchCategoryRecipe({category,tag})); 
    }
  }, [dispatch,category,tag]);

  useEffect(() => {
    if (toggleStatus === 'failed') {
      setShowAlert(true);

      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [toggleStatus]);


  const handleCategoryChange = (event) => {
    const {value} = event.target;
    setState((prev)=>{
      return{
        ...prev,
        category: value,
      }
    });
  };
  const handleTagChange = (event) => {
    const {value} = event.target;
    setState((prev)=>{
      return{
        ...prev,
        tag: value,
      }
    });
  };
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
        dispatch(submittedRecipeActions.toggleFavorite({ recipe_id  : updatedRecipe.recipe_id, is_favorite : updatedRecipe.is_favorite }));
      });

  }
  return (
  <>
     <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <SearchIcon sx={{ fontSize: 32, color: '#673ab7', mr: 1 }}/>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' , marginRight:'auto'}} >
          Browse by Category
        </Typography>
        <FormControl 
          sx={{ 
            m: 1, 
            minWidth: 220, 
            bgcolor: 'white', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          size="small"
        >
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            autoWidth
            label="Category"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Appetizer">Appetizer</MenuItem>
            <MenuItem value="Main Course">Main Course</MenuItem>
            <MenuItem value="Dessert">Dessert</MenuItem>
            <MenuItem value="Salad">Salad</MenuItem>
            <MenuItem value="Soup">Soup</MenuItem>
            <MenuItem value="Side Dish">Side Dish</MenuItem>
            <MenuItem value="Bevercategory">Bevercategory</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
            <MenuItem value="Sauce">Sauce</MenuItem>
            <MenuItem value="Bread">Bread</MenuItem>
          </Select>
        </FormControl>
        <FormControl 
          sx={{ 
            m: 1, 
            minWidth: 220, 
            bgcolor: 'white', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          size="small"
        >
          <InputLabel id="category-select-label">Tag</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={tag}
            onChange={handleTagChange}
            autoWidth
            label="Tag"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Vegan">Vegan</MenuItem>
            <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
            <MenuItem value="Spicy">Spicy</MenuItem>
            <MenuItem value="Sweet">Sweet</MenuItem>
            <MenuItem value="Low Carb">Low Carb</MenuItem>
            <MenuItem value="High Protein">High Protein</MenuItem>
            <MenuItem value="Dairy-Free">Dairy-Free</MenuItem>
            <MenuItem value="Nut-Free">Nut-Free</MenuItem>
            <MenuItem value="Quick">Quick</MenuItem>
            <MenuItem value="Healthy">Healthy</MenuItem>
          </Select>
        </FormControl>
      </Box>
      { status === 'loading' && <Loader /> }
      { status === 'failed' && <Error message={error}/> }
      { status === 'succeeded' && <>
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
              <Recipe key={index} recipe={recipe} handleFavoriteToggle={onFavoriteToggle} toggleStatus={toggleStatus} />
            ))}
        </Grid>
      </> }
  </>
  );
}

export default Category;


