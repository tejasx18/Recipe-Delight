import express from "express";
import { getUserIdFromToken , getCategory } from "../models/user.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const { category , tag } = req.query;
    const userId = getUserIdFromToken(token);
    const result = await getCategory(userId , category , tag);
    if(result.length === 0 ){
      return res.status(409).send({ message: 'Sorry, Recipe list is Empty!' })
    }
    res.json(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
