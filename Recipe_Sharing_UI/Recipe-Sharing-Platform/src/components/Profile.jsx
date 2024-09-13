import { Avatar, Box, ToggleButtonGroup, ToggleButton, Typography, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import  SubmittedRecipe from "./SubmittedRecipe"
import FavouriteRecipe from "./FavouriteRecipe";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../store/userDataSlice";

const Profile = () => {
  const [alignment, setAlignment] = useState('submitted');
  const dispatch = useDispatch();
  const { profileImage, userName } = useSelector((state)=>state.userData);


  const handleImageUpload = async(e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem('token');

    if(file){
      try {
        const response = await axios.post('http://localhost:3000/api/uploadProfile', {image:file}, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
            'Content-Type': 'multipart/form-data', // Ensure correct content type
          },
        });
        dispatch(fetchUserData());
      } catch (error) {
        console.log(error);
      }
    }

  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <>
      <Box sx={{ display: "flex" , p:3 , gap:4}}>
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Avatar
              src={`data:image/png;base64,${profileImage}`}
              sx={{ width: 120, height: 120 , position : 'relative'}}
            />    
            <IconButton
              component="label"
              size='small'
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'black',
                '&:hover': {
                  color:'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
            >
              <EditIcon  />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </IconButton>
          </Box>
          
          <Typography variant='h2' sx={{fontWeight:'bold', color:'#673ab7',marginTop:2}}>{userName}</Typography>
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
