import upload from './upload.js'; 

const conditionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.includes('multipart/form-data')) {
    return next(); 
  }

  try {
    upload.single("logo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next(); 
    });
  } catch (err) {
    return res.status(500).json({ message: 'Upload error', details: err.message });
  }
};

export default conditionalUpload;
