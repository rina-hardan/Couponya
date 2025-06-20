import categoriesModel from "../models/categoriesModels.js";

const categoriesController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      const result = await categoriesModel.addCategory({ name });
      if (!result.success) {
        return res.status(500).json({ error: "Failed to add category" });
      }

      res.status(201).json({ message: "Category added successfully", id: result.id });
    } catch (err) {
      console.error("Error in addCategory:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await categoriesModel.getCategories();
      res.status(200).json({ categories });
    } catch (err) {
      console.error("Error in getCategories:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default categoriesController;
