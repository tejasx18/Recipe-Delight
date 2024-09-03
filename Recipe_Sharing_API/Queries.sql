-- Create the Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

-- Create the trigger to call the function on update
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON Users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create the Recipes table
CREATE TABLE Recipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT,
    steps TEXT,
    image TEXT,
    category_id INTEGER REFERENCES Categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

-- Create the trigger to call the function on update
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON Recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();


-- Create the Categories table
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);


-- Create the Tags table
CREATE TABLE Tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create the Recipe_Tags table
CREATE TABLE Recipe_Tags (
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES Tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

-- Create the Comments table
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the Ratings table
CREATE TABLE Ratings (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the Favorites table
CREATE TABLE Favorites (
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, recipe_id)
);

-- get featured recipes
SELECT 
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
        favorites f ON r.id = f.recipe_id AND f.user_id = $1 -- Filtering recipes submitted by the specific user
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
    LIMIT 10;

-- get user submitted recipes
SELECT 
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
        favorites f ON r.id = f.recipe_id AND f.user_id = 4 -- Filtering recipes submitted by the specific user
    LEFT JOIN
        recipe_tags rtg ON r.id = rtg.recipe_id
    LEFT JOIN
        tags t ON rtg.tag_id = t.id
    LEFT JOIN
        comments c ON r.id = c.recipe_id
    WHERE
        r.user_id = 4  -- Filtering recipes submitted by the specific user
    GROUP BY
        r.id, r.name, r.image, r.description
    ORDER BY
        r.updated_at DESC ;

-- get recipes by category,tag
SELECT 
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
          favorites f ON r.id = f.recipe_id AND f.user_id = $1 -- Filtering recipes submitted by the specific user
      LEFT JOIN
          recipe_tags rtg ON r.id = rtg.recipe_id
      LEFT JOIN
          tags t ON rtg.tag_id = t.id
      LEFT JOIN
          comments c ON r.id = c.recipe_id
      LEFT JOIN
          categories ct ON r.category_id = ct.id 
      WHERE
          ($2::VARCHAR IS NULL OR ct.name = $2::VARCHAR)   -- Filtering recipes by category
          AND ($3::VARCHAR IS NULL OR t.name = $3::VARCHAR) -- Filtering recipes by tag
      GROUP BY
          r.id, r.name, r.image, r.description
      ORDER BY
          r.updated_at DESC;




