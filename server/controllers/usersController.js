import usersModel from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETKEY || 'SECRETKEY';

const usersController = {

  register: async (req, res) => {
    try {
      const { userName, name, email, password, role, birth_date, region_id, business_name, description, website_url } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const created_at = new Date();

      const baseUserData = { userName, name, email, password: hashedPassword, role, created_at };

      let fullUserData;

      if (role === "customer") {
        fullUserData = await usersModel.registerCustomerUser({ ...baseUserData, birth_date, region_id });

      } else if (role === "business_owner") {
        const file = req.file;
        const logo_url = file ? `/uploads/${file.filename}` : null;

        fullUserData = await usersModel.registerBusinessOwnerUser({ ...baseUserData, business_name, description, website_url, logo_url });
      }
      const { userId, ...publicUserData } = fullUserData;
      const token = jwt.sign({ userId, role, email }, secretKey, { expiresIn: '1h' });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          ...publicUserData
        },
        token
      });

    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }
      console.error("Registration error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  ,
  login: async (req, res) => {
    try {

      const { email, password } = req.body;

      const user = await usersModel.getUserByEmail(email);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

      const registeredUser = { ...user };
      delete registeredUser.password;

      const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, secretKey, { expiresIn: '1h' });

      res.json({
        message: "Login successful",
        user: registeredUser,
        token
      });

    } catch (err) {

      console.error("Error in login:", err);
      res.status(500).json({ message: "Error in login:" + err.message });
    }
  }
  ,
  updateUser : async (req, res) => {
  const userId = req.userId;
  const userType = req.role;
  const data = { ...req.body };

  if (req.file) {
    data.logo_url = `/uploads/${req.file.filename}`;
  }

  try {
    const result = await usersModel.updateUser(userId, data, userType);
    if (result.success) {
      return res.status(200).json({ message: "User updated successfully", user: result.user });
    }
    return res.status(400).json({ message: result.message });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
};

export default usersController;
