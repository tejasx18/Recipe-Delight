import { Avatar, Box, Stack ,Grid, ToggleButtonGroup, ToggleButton} from "@mui/material";
import { useState } from "react";
import  SubmittedRecipe from "./SubmittedRecipe"
import FavouriteRecipe from "./FavouriteRecipe";



const Profile = () => {
  const [alignment, setAlignment] = useState('submitted');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Stack p={5} pt={3} spacing={4} direction='row' width='100%'>
          <Avatar
            src="/assets/profile.jfif"
            sx={{ width: 120, height: 120 }}
          />
          <Grid container  >
            <Grid item md={2}>
              grid 1
            </Grid>
            <Grid item md={10}>
                <h1>grid 2</h1>
            </Grid>
            <Grid item md={2}>
              <h1>grid 3</h1>
            </Grid>
            <Grid item md={10}>
              <h1>grid 4</h1>
            </Grid>
          </Grid>
        </Stack>
      </Box>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        fullWidth
        sx={{mb:2}}
      >
          <ToggleButton value="submitted">Submitted</ToggleButton>
          <ToggleButton value="favourite">favourite</ToggleButton>
      </ToggleButtonGroup>
      {alignment === 'submitted' &&  <SubmittedRecipe /> }
      {alignment === 'favourite' &&  <FavouriteRecipe />}
    </>
  );
};

export default Profile;
