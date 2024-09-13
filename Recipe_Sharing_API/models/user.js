import {db} from "../index.js";
import jwt from 'jwt-simple';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';



const generateAuthToken = (userId) => {
  const token = jwt.encode({ id: userId }, process.env.JWTPRIVATEKEY, 'HS256', { expiresIn: '7d' });
  return token;
};

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.decode(token, process.env.JWTPRIVATEKEY);
    return decoded.id;
  } catch (err) {
    console.error('Invalid token:', err.message);
    return null;
  }
};

// Validate user data using Joi
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
    profilePicture: Joi.string().uri().optional().label('Profile Picture')
  });
  return schema.validate(data);
};

// Function to create a new user
const createUser = async (userData) => {
  const { name, email, password, profilePicture } = userData;
  const result = await db.query(
    'INSERT INTO Users (name, email, password, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, email, password, profilePicture || null] 
  );
  return result.rows[0].id;
};

// Function to update the user profile picture
const updateUserProfilePicture = async (userId, profilePictureUrl) => {
  await db.query(
    'UPDATE Users SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [profilePictureUrl, userId]
  );
};


const getFeaturedRecipes = async(userId) =>{
  const result = await db.query(
      `SELECT 
            r.id AS recipe_id,
            r.name AS recipe_name,
            ENCODE(r.image, 'base64') AS recipe_image,
            r.description AS recipe_description,
            r.ingredients AS ingredients,
            r.steps AS recipe_steps,
            COALESCE(AVG(rt.rating), 0) AS average_rating,
            MAX(CASE
                WHEN f.user_id IS NOT NULL THEN 1
                ELSE 0
            END)::BOOLEAN AS is_favorite,
            ARRAY_AGG(DISTINCT t.name) AS tags,
            ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments,
            (SELECT rt_user.rating
            FROM ratings rt_user
            WHERE rt_user.recipe_id = r.id AND rt_user.user_id = $1
            LIMIT 1) AS user_rating
        FROM
            recipes r
        LEFT JOIN
            ratings rt ON r.id = rt.recipe_id
        LEFT JOIN
            favorites f ON r.id = f.recipe_id AND f.user_id = $1
        LEFT JOIN
            recipe_tags rtg ON r.id = rtg.recipe_id
        LEFT JOIN
            tags t ON rtg.tag_id = t.id
        LEFT JOIN
            comments c ON r.id = c.recipe_id
        GROUP BY
            r.id, r.name, r.image, r.description , r.steps
        ORDER BY
            average_rating DESC
        LIMIT 12;
      `,
      [userId]
  );

  return result.rows;

}

const getSubmittedRecipes = async(userId) => {
  const result = await db.query(
    `SELECT 
        r.id AS recipe_id,
        r.name AS recipe_name,
        ENCODE(r.image, 'base64') AS recipe_image,
        r.description AS recipe_description,
        r.ingredients AS ingredients,
        r.steps AS recipe_steps,
        COALESCE(AVG(rt.rating), 0) AS average_rating,
        MAX(CASE
            WHEN f.user_id IS NOT NULL THEN 1
            ELSE 0
        END)::BOOLEAN AS is_favorite,
        ARRAY_AGG(DISTINCT t.name) AS tags,
        ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments,
        (SELECT rt_user.rating
            FROM ratings rt_user
            WHERE rt_user.recipe_id = r.id AND rt_user.user_id = $1
            LIMIT 1) AS user_rating
      FROM
        recipes r
      LEFT JOIN
        ratings rt ON r.id = rt.recipe_id
      LEFT JOIN
        favorites f ON r.id = f.recipe_id AND f.user_id = $1
      LEFT JOIN
        recipe_tags rtg ON r.id = rtg.recipe_id
      LEFT JOIN
        tags t ON rtg.tag_id = t.id
      LEFT JOIN
        comments c ON r.id = c.recipe_id
      WHERE
        r.user_id = $1  
      GROUP BY
        r.id, r.name, r.image, r.description, r.updated_at , r.steps
      ORDER BY
        r.updated_at DESC;`,
    [userId]
  );
  return result.rows;
}

const getFavouriteRecipes = async(userId) => {
  const result = await db.query(
    `SELECT 
        r.id AS recipe_id,
        r.name AS recipe_name,
        ENCODE(r.image, 'base64') AS recipe_image,
        r.description AS recipe_description,
        r.ingredients AS ingredients,
        r.steps AS recipe_steps,
        COALESCE(AVG(rt.rating), 0) AS average_rating,
        (SELECT rt_user.rating
            FROM ratings rt_user
            WHERE rt_user.recipe_id = r.id AND rt_user.user_id = $1
            LIMIT 1) AS user_rating,
        ARRAY_AGG(DISTINCT t.name) AS tags,
        ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments,
        TRUE AS is_favorite 
      FROM
        recipes r
      JOIN
        favorites f ON r.id = f.recipe_id AND f.user_id = $1
      LEFT JOIN
        ratings rt ON r.id = rt.recipe_id
      LEFT JOIN
        recipe_tags rtg ON r.id = rtg.recipe_id
      LEFT JOIN
        tags t ON rtg.tag_id = t.id
      LEFT JOIN
        comments c ON r.id = c.recipe_id
      WHERE
        f.user_id = $1  
      GROUP BY
        r.id, r.name, r.image, r.description, r.updated_at , r.steps
      ORDER BY
        r.updated_at;`,
    [userId]
  );
  return result.rows;
}

const removeFavourite = async (user_id, recipe_id) => {
  const result = await db.query(
    'DELETE FROM favorites  WHERE recipe_id = $1 AND user_id = $2 ;',
    [recipe_id, user_id] 
  );
  return result.rowCount;
};

const addFavourite = async (user_id, recipe_id) => {
  const result = await db.query(
    'INSERT INTO favorites(user_id,recipe_id) VALUES ($1,$2) RETURNING user_id ;',
     [user_id,recipe_id]
  );
  return result.rowCount;
};

const getCategory = async (user_id, category, tag) => {
  const result = await db.query(
    `SELECT 
          r.id AS recipe_id,
          r.name AS recipe_name,
          ENCODE(r.image, 'base64') AS recipe_image,
          r.description AS recipe_description,
          r.steps AS recipe_steps,
          r.ingredients AS ingredients,
          COALESCE(AVG(rt.rating), 0) AS average_rating,
          MAX(CASE
              WHEN f.user_id IS NOT NULL THEN 1
              ELSE 0
          END)::BOOLEAN AS is_favorite,
          ARRAY_AGG(DISTINCT t.name) AS tags,
          ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments,
          (SELECT rt_user.rating
            FROM ratings rt_user
            WHERE rt_user.recipe_id = r.id AND rt_user.user_id = $1
            LIMIT 1) AS user_rating
      FROM
          recipes r
      LEFT JOIN
          ratings rt ON r.id = rt.recipe_id
      LEFT JOIN
          favorites f ON r.id = f.recipe_id AND f.user_id = $1
      LEFT JOIN
          recipe_tags rtg ON r.id = rtg.recipe_id
      LEFT JOIN
          tags t ON rtg.tag_id = t.id
      LEFT JOIN
          comments c ON r.id = c.recipe_id
      LEFT JOIN
          categories ct ON r.category_id = ct.id 
      WHERE
          ($2::VARCHAR IS NULL OR ct.name = $2::VARCHAR)
          AND ($3::VARCHAR IS NULL OR t.name = $3::VARCHAR)
      GROUP BY
          r.id, r.name, r.image, r.description , r.steps
      ORDER BY
          r.updated_at DESC;`,
    [user_id, category || null, tag || null]
  );
  return result.rows;
};

const addRecipe = async (recipeName,description,tags,steps,category,ingredients,image,userId) => {
  const categoryResult = await db.query(
    'SELECT id FROM Categories WHERE name = $1',
    [category]
  );
  const categoryId = categoryResult.rows[0]?.id;
  if (!categoryId) {
    return { message: "Invalid category name" };
  }

  // Insert the recipe into the Recipes table
  const result = await db.query(
    'INSERT INTO Recipes (name, description, ingredients, steps, image, category_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [recipeName, description, ingredients, steps, image, categoryId, userId]
  );
  const recipeId = result.rows[0].id;

  // Handle tags: convert comma-separated tags into an array, then insert into Recipe_Tags
  const tagNamesArray = tags.split(',').map(tag => tag.trim());
  const tagResults = await db.query(
    'SELECT id FROM Tags WHERE name = ANY($1::text[])',
    [tagNamesArray]
  );
  const tagIds = tagResults.rows.map(row => row.id);

  const tagInsertPromises = tagIds.map(tagId => {
    return db.query(
      'INSERT INTO Recipe_Tags (recipe_id, tag_id) VALUES ($1, $2)',
      [recipeId, tagId]
    );
  });

  await Promise.all(tagInsertPromises);
  return  { message: "Success" };
}

const getUserData = async (userID) =>{
  const result = await db.query(
    `SELECT 
        ENCODE(profile_picture, 'base64') as profileImage,
        name as userName
      FROM
        users
      WHERE
        id = $1;`,
    [userID]);
  return result.rows;
}

const updateProfileImage = async (userID,image) =>{
  const result = await db.query(
    `Update 
        users
      SET 
        profile_picture = $1
      WHERE
        id = $2;`,
    [image,userID]);
  return result.rows;
}

export const handleRating = async (userId,recipe_id,rating) =>{
  const result = await db.query(
    `INSERT INTO ratings (user_id, recipe_id, rating, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, recipe_id)
      DO UPDATE SET
          rating = EXCLUDED.rating,
          created_at = EXCLUDED.created_at;`,
    [userId,recipe_id,rating]
  );
  return result.rowCount;
}

export const addComment = async (userId,recipe_id,comment) =>{
  const result = await db.query(
    `INSERT INTO comments (user_id, recipe_id, comment, created_at)
      VALUES ($1, $2, $3, NOW());`,
    [userId,recipe_id,comment]
  );
  return result.rowCount;
}

export { createUser, generateAuthToken, validate, updateUserProfilePicture ,getFeaturedRecipes, getUserIdFromToken , getSubmittedRecipes , getFavouriteRecipes , removeFavourite , addFavourite , getCategory , addRecipe , getUserData ,updateProfileImage};