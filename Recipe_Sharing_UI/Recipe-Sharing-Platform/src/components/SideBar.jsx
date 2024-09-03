import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from '../store';
import { useLocation } from 'react-router-dom';
// import { featuredRecipesActions } from '../store/featuredRecipeSlice';
// import { submittedRecipeActions } from '../store/submittedRecipeSlice';
// import { favouriteRecipeActions } from '../store/favouriteRecipeSlice';


const SideBar = () => {
  const location = useLocation();
  const [selectedTab , setSelectedTab] =  useState("/main");

  useEffect(()=>{
    setSelectedTab(location.pathname);
  },[location]);
  
  function HandleSelectedTab(event){
    const value = event.currentTarget.name;
     setSelectedTab(value);
  }

  const dispatch = useDispatch();
  function handleLogout(){
    dispatch(logout());
    // dispatch(featuredRecipesActions.logout());
    // dispatch(submittedRecipeActions.logout());
    // dispatch(favouriteRecipeActions.logout());
    localStorage.removeItem("token");
  }
  return (
    <Box
          sx={{
            width: { xs: 80, sm: 120, md: 160, lg: 180 },
            height: 'auto',
            backgroundColor: '#673ab7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#fff'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1,
              width: '100%',
              p: 1,
              borderRadius: 1,
              color:'inherit',
              textDecoration:'none',
              backgroundColor: selectedTab === "/main/profile" ? '#512da8' : 'inherit',
              '&:hover': {
                backgroundColor: '#5e35b1',
                cursor: 'pointer',
              },
            }}
            name="profile"
            onClick={HandleSelectedTab}
            component={Link}
            to="/main/profile"
          >
            <AccountCircleIcon sx={{ marginRight: 2 }} />
            <Typography variant="body2">Profile</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1,
              width: '100%',
              padding: 1,
              borderRadius: 1,
              color:'inherit',
              textDecoration:'none',
              backgroundColor: selectedTab === "/main" ? '#512da8' : 'inherit',
              '&:hover': {
                backgroundColor: '#5e35b1',
                cursor: 'pointer',
              },
            }}
            name="home"
            onClick={HandleSelectedTab}
            component={Link}
            to="/main"
          >
            <HomeIcon sx={{ marginRight: 2 }} />
            <Typography variant="body2">Home</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1,
              width: '100%',
              padding: 1,
              borderRadius: 1,
              color:'inherit',
              textDecoration:'none',
              backgroundColor: selectedTab === "/main/category" ? '#512da8' : 'inherit',
              '&:hover': {
                backgroundColor: '#5e35b1',
                cursor: 'pointer',
              },
            }}
            name="category"
            onClick={HandleSelectedTab}
            component={Link}
            to="/main/category"
          >
            <CategoryIcon sx={{ marginRight: 2 }} />
            <Typography variant="body2">Category</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1,
              width: '100%',
              padding: 1,
              borderRadius: 1,
              color:'inherit',
              textDecoration:'none',
              backgroundColor: selectedTab === "/main/upload" ? '#512da8' : 'inherit',
              '&:hover': {
                backgroundColor: '#5e35b1',
                cursor: 'pointer',
              },
            }}
            name="upload"
            onClick={HandleSelectedTab}
            component={Link}
            to="/main/upload"
          >
            <CloudUploadIcon sx={{ marginRight: 2 }} />
            <Typography variant="body2">Upload</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 1,
              width: '100%',
              padding: 1,
              borderRadius: 1,
              color:'inherit',
              textDecoration:'none',
              '&:hover': {
                backgroundColor: '#5e35b1',
                cursor: 'pointer',
              },
            }}
            component={Link}
            to="/"
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ marginRight: 2 }} />
            <Typography variant="body2">Logout</Typography>
          </Box>
        </Box>
  );
};

export default SideBar;
