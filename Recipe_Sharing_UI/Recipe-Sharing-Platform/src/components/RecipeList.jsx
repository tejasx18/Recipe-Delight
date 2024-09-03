/* eslint-disable react/prop-types */
import { Grid } from "@mui/material";
import Recipe from "./recipe";

const RecipeList = ({recipes}) => {
  return (
    <Grid container spacing={3} px={2}>
        {recipes.map((recipe, index) => (
            <Recipe key={index} recipe={recipe}/>
        ))}
      </Grid>
  );
}

export default RecipeList;