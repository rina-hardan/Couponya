import regionsModel from "../models/regionsModel.js";


const regionsController = {
 addRegion: async (req, res) => {
  try {
    const {name } = req.body;
       const img_url = req.file ? `/uploads/${req.file.filename}` : null;

      const returnedData = await regionsModel.addRegion({ name, img_url });
      if (!returnedData.success) {
        return res.status(500).json({ error: "Failed to add region" });
      }
    
    res.status(201).json({ message: "region added successfully"});

  } catch (err) {
    console.error("Error in adding region:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
,

    getRegions: async (req, res) => {
    try {
        const regions = await regionsModel.getRegions();
    res.status(200).json({ regions });
    } catch (error) {
        console.error("Error getting regions:", error);
        res.status(500).json({ message: "Error getting regions:"+ error.message });
    }               
    }

};

export default regionsController;
