import express from "express";
import {getUserIdFromToken , addComment} from "../models/user.js";

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
    const { comment , recipe_id } = req.body;
    const result = await addComment(userId,recipe_id,comment) ;
    res.send("Success");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;