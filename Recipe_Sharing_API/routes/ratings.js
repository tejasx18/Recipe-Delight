import express from "express";
import {getUserIdFromToken , handleRating} from "../models/user.js";

const router = express.Router();

router.post("/", async (req,res) => {
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
    const { rating , recipe_id } = req.body;
    const result = await handleRating(userId,recipe_id,rating) ;
    res.send("Success");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;