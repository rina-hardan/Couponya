import upload from './upload.js';

const conditionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  if (!contentType.includes('multipart/form-data')) {
    return next(); 
  }

  upload.single("logo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next(); 
  });
};

export default conditionalUpload;
