import express from 'express';
import { createUser, generateAuthToken, validate } from '../models/user.js'; 
import bcrypt from 'bcrypt';
import {db} from "../index.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Validate the request body
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { email, password, name, profilePicture } = req.body;

    // Check if user already exists
    const result = await db.query('SELECT id FROM Users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(409).send({ message: 'User with given email already exists!' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const userId = await createUser({ name, email, password: hashPassword, profilePicture });

    // Generate authentication token
    const token = generateAuthToken(userId);

    res.status(201).send({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
