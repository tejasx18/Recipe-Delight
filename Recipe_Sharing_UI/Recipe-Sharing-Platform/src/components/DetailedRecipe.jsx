/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, Card, CardMedia, CardContent, Rating, TextField, Box, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { favouriteRecipeActions } from "../store/favouriteRecipeSlice";
import { featuredRecipesActions } from "../store/featuredRecipeSlice";
import { categoryRecipesActions } from "../store/categoryRecipeSlice";
import { submittedRecipeActions  } from "../store/submittedRecipeSlice";


const DetailedRecipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;
  const dispatch = useDispatch();
  const [comment,setComment] = useState("");
  const [rating , setRating] = useState(recipe.user_rating);
  const [comments,setComments] = useState(recipe.comments || []);
  if (!recipe) {
    return <Typography variant="h6" color="error">No recipe details available.</Typography>;
  }

  const ingredientsArray = recipe.ingredients ? recipe.ingredients.split('\r\n') : [];
  const stepsArray = recipe.recipe_steps ? recipe.recipe_steps.split('\r\n') : [];

  const handleRatingsChange = async (e) => {
    const { value } = e.target;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/rating", 
        { rating: value , recipe_id : recipe.recipe_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRating(Number(value));
      dispatch(favouriteRecipeActions.updateRecipeRating({ recipe_id: recipe.recipe_id, rating: Number(value) }));
      dispatch(featuredRecipesActions.updateRecipeRating({ recipe_id: recipe.recipe_id, rating: Number(value) }));
      dispatch(submittedRecipeActions.updateRecipeRating({ recipe_id: recipe.recipe_id, rating: Number(value) }));
      dispatch(categoryRecipesActions.updateRecipeRating({ recipe_id: recipe.recipe_id, rating: Number(value) }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value); 
  };

  const handleSubmit = async() => {
    if(comment !== ''){
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/comment", 
        { comment: comment , recipe_id : recipe.recipe_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(favouriteRecipeActions.updateRecipeComment({ recipe_id: recipe.recipe_id, comment: comment }));
      dispatch(featuredRecipesActions.updateRecipeComment({ recipe_id: recipe.recipe_id, comment: comment }));
      dispatch(submittedRecipeActions.updateRecipeComment({ recipe_id: recipe.recipe_id, comment: comment }));
      dispatch(categoryRecipesActions.updateRecipeComment({ recipe_id: recipe.recipe_id, comment: comment }));
      setComments((prev) => [...prev,comment]);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  }
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="text"
        color="primary"
      >
        Back
      </Button>
      <Card sx={{ maxWidth: 800, margin: '0 auto', boxShadow: 3, borderRadius: 2 }}>
        <CardMedia
          component="img"
          height="400"
          image={`data:image/png;base64,${recipe.recipe_image}`}
          alt={recipe.recipe_name}
          sx={{ borderRadius: '4px 4px 0 0' }}
        />
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {recipe.recipe_name}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
            {recipe.recipe_description}
          </Typography>

          {ingredientsArray.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Ingredients:
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {ingredientsArray.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              No ingredients available.
            </Typography>
          )}

          {stepsArray.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Preparation Steps:
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {stepsArray.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              No preparation steps available.
            </Typography>
          )}

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Ratings
              </Typography>
              <Rating
                value={rating}
                sx={{ color: '#ffb400' }}
                onChange={handleRatingsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Comments
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Add a comment..."
                multiline
                rows={2}
                sx={{ mb: 2 }}
                value={comment}
                onChange={handleCommentChange}
                
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>

          {comments && comments.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                User Comments:
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                {comments.map((c, index) => (
                  <li key={index}>{c}</li>
                ))}
              </ul>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              No comments available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>

  );
};

export default DetailedRecipe;
