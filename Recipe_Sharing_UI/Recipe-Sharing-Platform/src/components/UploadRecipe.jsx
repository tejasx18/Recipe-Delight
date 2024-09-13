/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Typography, Alert } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { submittedRecipeActions  } from "../store/submittedRecipeSlice";
import { featuredRecipesActions } from "../store/featuredRecipeSlice";
import { categoryRecipesActions } from "../store/categoryRecipeSlice";

const UploadRecipe = () => {
  const dispatch = useDispatch();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [steps, setSteps] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [status , setStatus] = useState('');
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('recipeName', recipeName);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('tags', tags);
    formData.append('steps', steps);
    formData.append('category', category);
    formData.append('ingredients', ingredients);

    const token = localStorage.getItem('token');

      try {
        const response = await axios.post('http://localhost:3000/api/uploadRecipe', formData, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the headers
            'Content-Type': 'multipart/form-data', // Ensure correct content type
          },
        });
        setStatus('success')
        dispatch(submittedRecipeActions.changeStatus());
        dispatch(featuredRecipesActions.changeStatus());
        dispatch(categoryRecipesActions.changeStatus());

        setRecipeName('');
        setDescription('');
        setImage('');
        setImagePreview(null);
        setTags([]);
        setSteps('');
        setCategory('');
        setIngredients('');
      } catch (error) {
        setStatus('failed');
      }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        {status === 'failed' && (
            <Alert severity="error">Error!, while uploading recipe . PLease try later.</Alert> 
        )}
        </Box>
      <Box component="form" sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              width: '100%',
              height: 250,
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography variant="subtitle1" color="textSecondary">
                No image uploaded
              </Typography>
            )}
          </Box>
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <PhotoCamera />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </IconButton>
        </Box>
        <TextField 
          label="Recipe Name" 
          value={recipeName} 
          onChange={(e) => setRecipeName(e.target.value)} 
          fullWidth 
          required 
          sx={{ mb: 2 }}
        />
        <TextField 
          label="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          fullWidth 
          required 
          multiline 
          rows={2} 
          sx={{ mb: 2 }}
        />
        <TextField 
          label="Ingredients" 
          value={ingredients} 
          onChange={(e) => setIngredients(e.target.value)} 
          fullWidth 
          required 
          multiline 
          rows={2} 
          sx={{ mb: 2 }}
        />
        <TextField 
          label="Steps" 
          value={steps} 
          onChange={(e) => setSteps(e.target.value)} 
          fullWidth 
          required 
          multiline 
          rows={4} 
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="Appetizer">Appetizer</MenuItem>
            <MenuItem value="Main Course">Main Course</MenuItem>
            <MenuItem value="Dessert">Dessert</MenuItem>
            <MenuItem value="Salad">Salad</MenuItem>
            <MenuItem value="Soup">Soup</MenuItem>
            <MenuItem value="Side Dish">Side Dish</MenuItem>
            <MenuItem value="Beverage">Beverage</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
            <MenuItem value="Sauce">Sauce</MenuItem>
            <MenuItem value="Bread">Bread</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tags</InputLabel>
          <Select 
            multiple 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
          >
            <MenuItem value=""></MenuItem>
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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
          fullWidth
        >
          Submit Recipe
        </Button>
      </Box>
    </>
  );
};

export default UploadRecipe;
