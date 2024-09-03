import { AppBar, Box, Button, InputAdornment, InputBase, Stack, Toolbar, Typography } from "@mui/material";
import  SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../store';
// import { featuredRecipesActions } from '../store/featuredRecipeSlice';
// import { submittedRecipeActions } from '../store/submittedRecipeSlice';
// import { favouriteRecipeActions } from '../store/favouriteRecipeSlice';


const Header = () => {
  const dispatch = useDispatch();
  function handleLogout(){
    dispatch(logout());
    // dispatch(featuredRecipesActions.logout());
    // dispatch(submittedRecipeActions.logout());
    // dispatch(favouriteRecipeActions.logout());
    localStorage.removeItem("token");
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: '#673ab7', boxShadow: 'none',borderBottom:'1px solid white' }}>
        <Toolbar>
          <Stack alignItems="center" direction="row" spacing={1} sx={{ flex: 1 }}>
            <LunchDiningIcon />
            <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: '#fff' }}>
              Recipe Delight
            </Typography>
          </Stack>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <InputBase
              placeholder="Search recipes..."
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#673ab7' }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '20px',
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: 400,
                padding: '0 16px',
                color: '#673ab7',
              }}
            />
          </Box>
          <Button
              variant="outlined"
              color="inherit"
              endIcon={<LogoutIcon />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
              onClick={handleLogout}
              component={Link}
              to="/"
            >
              Logout
            </Button>
        </Toolbar>
      </AppBar>

  );
}

export default Header;