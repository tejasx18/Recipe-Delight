import express from "express";
import { getUserIdFromToken , removeFavourite , addFavourite } from "../models/user.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("entered");
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const userId = getUserIdFromToken(token);
    const { recipe_id , recipe_add } = req.body;
    console.log(recipe_id+","+recipe_add+","+req.body);
    let result = 0;
    if(recipe_add){
      result = await addFavourite(userId, recipe_id);
    }else{
      result = await removeFavourite(userId, recipe_id);
    }
    if(result === 0 ){
      return res.status(409).json({ message: "Failed to update favorite status" });
    }
    res.json({recipe_id : recipe_id,is_favorite : recipe_add});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
