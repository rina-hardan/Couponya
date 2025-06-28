import categoriesModel from "../models/categoriesModels.js";

const categoriesController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const img_url = req.file ? `/uploads/${req.file.filename}` : null;

      const result = await categoriesModel.addCategory({ name, img_url });
      if (!result.success) {
        return res.status(500).json({ message: "Failed to add category" });
      }
      res.status(201).json({
        name,
        img_url: img_url ?  img_url : null,
        id: result.categoryId,

      });
    } catch (err) {
      console.error("Error in addCategory:", err);
      res.status(500).json({ message: "Error in addCategory:" + err.message });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await categoriesModel.getCategories();
      res.status(200).json({ categories });
    } catch (err) {
      console.error("Error in getCategories:", err);
      res.status(500).json({ message: "Error in getCategories:" + err.message });
    }
  }
};

export default categoriesController;
