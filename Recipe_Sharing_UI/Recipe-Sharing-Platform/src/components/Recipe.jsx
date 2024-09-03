/* eslint-disable react/prop-types */
import { Button, Typography, Grid, Card, CardMedia, CardContent, CardActions, IconButton, Rating, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Recipe = ({ recipe , handleFavoriteToggle }) => {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card sx={{ borderRadius: 2, boxShadow: '0 3px 10px rgba(0,0,0,0.1)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
        <CardMedia
          component="img"
          height="200"
          image={recipe.recipe_image}
          alt={recipe.recipe_name}
        />
        <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ color: '#333', flexGrow: 1 }}>
              {recipe.recipe_name}
            </Typography>
            <Rating
              name="read-only"
              value={Math.floor(Number(recipe.average_rating))}
              precision={0.5}
              readOnly
              sx={{ color: '#ffb400' }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {recipe.recipe_description}
          </Typography>
          
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
          <IconButton aria-label="add to favorites" onClick={()=>{handleFavoriteToggle(recipe)}}>
            <FavoriteIcon sx={{ color: recipe.is_favorite ? '#e57373' : '#ccc' }} />
          </IconButton>
          <Button size="small" sx={{ color: '#673ab7' }}>View Recipe</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default Recipe;
