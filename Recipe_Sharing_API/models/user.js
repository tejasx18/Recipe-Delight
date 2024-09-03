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
            r.image AS recipe_image,
            r.description AS recipe_description,
            COALESCE(AVG(rt.rating), 0) AS average_rating,
            MAX(CASE
                WHEN f.user_id IS NOT NULL THEN 1
                ELSE 0
            END)::BOOLEAN AS is_favorite,
            ARRAY_AGG(DISTINCT t.name) AS tags,
            ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments
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
            r.id, r.name, r.image, r.description
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
        r.image AS recipe_image,
        r.description AS recipe_description,
        COALESCE(AVG(rt.rating), 0) AS average_rating,
        MAX(CASE
            WHEN f.user_id IS NOT NULL THEN 1
            ELSE 0
        END)::BOOLEAN AS is_favorite,
        ARRAY_AGG(DISTINCT t.name) AS tags,
        ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments
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
        r.id, r.name, r.image, r.description, r.updated_at
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
        r.image AS recipe_image,
        r.description AS recipe_description,
        COALESCE(AVG(rt.rating), 0) AS average_rating,
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
        r.id, r.name, r.image, r.description, r.updated_at
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
  console.log(user_id +","+ recipe_id +","+ result.rowCount);
  return result.rowCount;
};

const getCategory = async (user_id, category, tag) => {
  const result = await db.query(
    `SELECT 
          r.id AS recipe_id,
          r.name AS recipe_name,
          r.image AS recipe_image,
          r.description AS recipe_description,
          COALESCE(AVG(rt.rating), 0) AS average_rating,
          MAX(CASE
              WHEN f.user_id IS NOT NULL THEN 1
              ELSE 0
          END)::BOOLEAN AS is_favorite,
          ARRAY_AGG(DISTINCT t.name) AS tags,
          ARRAY_AGG(DISTINCT c.comment) FILTER (WHERE c.comment IS NOT NULL) AS comments
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
          r.id, r.name, r.image, r.description
      ORDER BY
          r.updated_at DESC;`,
    [user_id, category || null, tag || null]
  );
  return result.rows;
};


export { createUser, generateAuthToken, validate, updateUserProfilePicture ,getFeaturedRecipes, getUserIdFromToken , getSubmittedRecipes , getFavouriteRecipes , removeFavourite , addFavourite , getCategory };