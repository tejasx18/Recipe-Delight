import express from "express";
import multer from 'multer';
import { getUserIdFromToken ,updateProfileImage } from "../models/user.js";


const router = express.Router();

const storage = multer.memoryStorage(); 
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
    const image = req.file ? req.file.buffer : null; 
    const result = await updateProfileImage(userId,image) ;
    res.send("Success");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
