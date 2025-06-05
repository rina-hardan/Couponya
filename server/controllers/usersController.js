import usersModel from "../models/usersModel.js";
import bcrypt from "bcrypt";

const usersController = {
    register: (req, res) => {
        const user = req.body;
        const { username, name, email, password } = user;
    
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }
    
        if (password.length < 5) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
    
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing the password:", err);
                return res.status(500).json({ error: "Error hashing the password" });
            }
    
            const userToSave = {
                name,
                username,
                email,
                password: hashedPassword
            };
    
            usersModel.register(userToSave, (err, result) => {
                if (err) {
                    console.error("Error adding the user to the database:", err);
                    return res.status(500).json({ error: "Error adding the user" });
                }
    
                res.status(201).json({ message: "User added successfully", userId: result.userId });
            });
        });
    },
   login: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    usersModel.getUserByUsername(username, (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: "Invalid username or password" });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error checking password" });
            if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;

            res.json({ message: "Login successful", user: userWithoutPassword });
        });
    });
}
};

export default usersController;