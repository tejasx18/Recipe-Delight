import express from "express";
import cors from "cors";
import env from "dotenv";
import connection from "./db.js"; 
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import featuredRecipe from "./routes/featuredRecipe.js"
import submittedRecipe from "./routes/submittedRecipe.js"
import favouriteRecipe from "./routes/favouriteRecipe.js"
import favouriteRecipeToggle from "./routes/favouriteRecipeToggle.js"
import categoryRecipe from "./routes/categoryRecipe.js";
const app = express();
const port = 3000;
env.config();
export const db = connection();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/featuredRecipe", featuredRecipe);
app.use("/api/submittedRecipe", submittedRecipe);
app.use("/api/favouriteRecipe", favouriteRecipe);
app.use("/api/favouriteRecipe/toggle", favouriteRecipeToggle);
app.use("/api/categoryRecipe", categoryRecipe);

app.listen(port, () => {
  console.log(`API Server Running at port ${port}`);
});


