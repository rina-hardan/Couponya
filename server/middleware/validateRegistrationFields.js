 const validateRegistrationFields = (req, res, next) => {
  const { userName, name, email, password, role } = req.body;
  const file = req.file;

  if (!userName || !name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  if (role === 'customer') {
    const { birth_date, region_id } = req.body;
    if (!birth_date || !region_id) {
      return res.status(400).json({ message: "Birth date and region are required for customers" });
    }
  }

  if (role === 'business_owner') {
    const { business_name } = req.body;
    if (!business_name) {
      return res.status(400).json({ message: "Business name is required for business owners" });
    }
  }
  next();
};
export default validateRegistrationFields;
