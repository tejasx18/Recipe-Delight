import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, Rating, TextField, List, ListItem, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';


const RecipeDetail = () => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = () => {
    setComments([...comments, commentText]);
    setCommentText('');
  };
  return (
    <>
     <Box mt={4}>
     <Typography variant="h4" gutterBottom>
       Recipe Name
     </Typography>
     <CardMedia
       component="img"
       height="300"
       image="https://source.unsplash.com/featured/?recipe-detail" // Replace with actual recipe detail image URL
       alt="Recipe Detail Image"
     />
     <Box mt={2}>
       <Typography variant="h5">Ingredients</Typography>
       <List>
         {/* Replace with dynamic content */}
         {['Ingredient 1', 'Ingredient 2', 'Ingredient 3'].map((ingredient, index) => (
           <ListItem key={index}>{ingredient}</ListItem>
         ))}
       </List>
       <Typography variant="h5" mt={2}>
         Preparation Steps
       </Typography>
       <List>
         {/* Replace with dynamic content */}
         {['Step 1', 'Step 2', 'Step 3'].map((step, index) => (
           <ListItem key={index}>{step}</ListItem>
         ))}
       </List>
       <Box mt={2} display="flex" alignItems="center">
         <Avatar alt="User" src="https://source.unsplash.com/featured/?user" /> {/* Replace with actual user avatar URL */}
         <Typography variant="body1" ml={2}>
           Posted by User Name
         </Typography>
       </Box>
     </Box>
   </Box>

   {/* Ratings and Comments */}
   <Box mt={4}>
     <Typography variant="h5">Rate this Recipe</Typography>
     <Rating
       value={rating}
       onChange={(event, newValue) => setRating(newValue)}
     />
     <Box mt={2}>
       <Typography variant="h5">Comments</Typography>
       <List>
         {comments.map((comment, index) => (
           <ListItem key={index}>{comment}</ListItem>
         ))}
       </List>
       <TextField
         label="Add a comment"
         variant="outlined"
         fullWidth
         multiline
         rows={4}
         value={commentText}
         onChange={(e) => setCommentText(e.target.value)}
         sx={{ mt: 2 }}
       />
       <Button
         variant="contained"
         color="primary"
         onClick={handleCommentSubmit}
         sx={{ mt: 2 }}
       >
         Submit Comment
       </Button>
     </Box>
   </Box>
   </>
  );
} 

export default RecipeDetail;


<Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        {/* Profile */}
        <Grid item sx={{ width: "100%" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <AccountCircleIcon  />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Profile
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Home */}
        <Grid item sx={{ width: "100%" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <HomeIcon  />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Home
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Category */}
        <Grid item sx={{ width: "100%" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CategoryIcon  />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Category
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Upload */}
        <Grid item sx={{ width: "100%" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CloudUploadIcon  />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Upload
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Logout */}
        <Grid item sx={{ width: "100%" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <LogoutIcon  />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Logout
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>