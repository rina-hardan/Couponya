import usersModel from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETKEY || 'SECRETKEY';

const usersController = {
  register: async (req, res) => {
    try {
      const { userName, name, email, password, role } = req.body;

      if (!name || !userName || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

    let extraData = {};
    if (role === "customer") {
      const { birth_date,region_id } = req.body;
      if (!birth_date) {
        return res.status(400).json({ error: "Birth date  is required for customers" });
      }
       if ( !region_id) {
        return res.status(400).json({ error: "region is required for customers" });
      }
      extraData = { birth_date, region_id };
    } else if (role === "business_owner") {
      const { business_name, description, website_url } = req.body;
       const logo_url = req.file ? `/uploads/${req.file.filename}` : null;
      if (!business_name) {
        return res.status(400).json({ error: "Business name is required for business owners" });
      }
      extraData = { business_name, description, website_url, logo_url };
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

      const userId = await usersModel.register(newUser);

      let returnedData = {};
      if (role === "customer") {
        returnedData = await usersModel.registerCustomer({ userId, ...extraData });
        if (!returnedData.success) {
          return res.status(500).json({ message: "Failed to register customer details" });
        }
      } else if (role === "business_owner") {
        returnedData = await usersModel.registerBusinessOwner({ userId, ...extraData });
        if (!returnedData.success) {
          return res.status(500).json({ message: "Failed to register business owner details" });
        }
      }
      const { success, ...cleanData } = returnedData;
      const token = jwt.sign({ userId: userId, role: role, email: email }, secretKey, { expiresIn: '1h' });
      res.status(201).json({ message: "User added successfully", user: { userId, role, email, userName, ...cleanData }, token });

    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Username or email already exists.' });
      }
      console.error("Error in register:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  ,

  login: async (req, res) => {
    try {

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

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

  update: async (req, res) => {
    const userId = req.userId;
    const userType = req.role;
    const incomingData = req.body;

    const forbiddenFields = ['email', 'userName', 'role', 'id'];

    const filteredData = {};
    for (const [key, value] of Object.entries(incomingData)) {
      if (!forbiddenFields.includes(key)) {
        filteredData[key] = value;
      }
    }
    if (req.file) {
      filteredData.logo_url = `/uploads/${req.file.filename}`;
    }
       if ("name" in filteredData && filteredData.name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    if (userType === "customer" && "address" in filteredData && filteredData.address.trim() === "") {
      return res.status(400).json({ message: "Address is required for customers" });
    }

    if (
      userType === "business_owner" &&
      (
        ("business_name" in filteredData && filteredData.business_name.trim() === "") ||
        ("description" in filteredData && filteredData.description.trim() === "")
      )
    ) {
      return res.status(400).json({ message: "Business name and description are required for business owners" });
    }
  // try {
//     const result = await usersModel.updateUser(userId, filteredData, userType);
//     if (result.success) {
//       res.status(200).json({ message: "User updated successfully." });
//     } else {
//       res.status(400).json({ error: result.error || "Failed to update user." });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// }
 

    try {
      const result = await usersModel.updateUser(userId, filteredData, userType);
      if (result.success) {
        res.status(200).json({ message: "User updated successfully." });
      } else {
        res.status(400).json({ message: result.error || "Failed to update user." });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }





};

export default usersController;
