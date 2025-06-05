import usersModel from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your_secret_key_here"; // עדכן לפי הקובץ שלך

const usersController = {
  register: async (req, res) => {
    try {
      const { userName, name, email, password, role } = req.body;

      if (!name || !userName || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        userName,
        name,
        email,
        role,
        created_at: new Date(),
        password: hashedPassword
      };

      const result = await usersModel.register(newUser);

      res.status(201).json({ message: "User added successfully", userId: result.userId });

    } catch (err) {
      console.error("Error in register:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const user = await usersModel.getUserByEmail(email);
      if (!user) return res.status(401).json({ error: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

      const registeredUser = { ...user };
      delete registeredUser.password;

      const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

      res.json({
        message: "Login successful",
        user: registeredUser,
        token
      });

    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default usersController;
