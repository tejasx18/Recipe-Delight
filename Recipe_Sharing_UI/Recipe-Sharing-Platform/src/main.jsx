// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import {Provider} from "react-redux";
import recipeStore from './store';
import Login from './components/Login';
import Signup from './components/Signup';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import Profile from './components/Profile'
import {fetchFeaturedRecipeLoader , fetchUserDataLoader} from './loaders/recipeLoader';
import Category from './components/Category';
import UploadRecipe from './components/UploadRecipe';
import DetailedRecipe from './components/DetailedRecipe';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/main',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/main',
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        loader: fetchFeaturedRecipeLoader,
      },
      {
        path: '/main/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        loader: fetchUserDataLoader,
      }, 
      {
        path: '/main/category',
        element: (
          <PrivateRoute>
            <Category />
          </PrivateRoute>
        ),
      }, 
      {
        path: '/main/category',
        element: (
          <PrivateRoute>
            <Category />
          </PrivateRoute>
        ),
      }, 
      {
        path: '/main/upload',
        element: (
          <PrivateRoute>
            <UploadRecipe />
          </PrivateRoute>
        ),
      }, 
      {
        path: '/main/recipe',
        element: (
          <PrivateRoute>
            <DetailedRecipe />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
]);

createRoot(document.getElementById('root')).render(
  
    <Provider store={recipeStore}>
      <RouterProvider router={router} />
    </Provider>,
)
