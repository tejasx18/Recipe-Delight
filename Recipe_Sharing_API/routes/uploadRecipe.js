import express from "express";
import multer from 'multer';
import { getUserIdFromToken , addRecipe } from "../models/user.js";


const router = express.Router();

// Setup multer for file handling
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({ storage });

router.post("/", upload.single('image'), async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const userId = getUserIdFromToken(token);
    const { recipeName, description, tags, steps, category ,ingredients } = req.body;
    const image = req.file ? req.file.buffer : null; 

    const result = await addRecipe(recipeName,description,tags,steps,category,ingredients,image,userId);
    res.send("Success");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
