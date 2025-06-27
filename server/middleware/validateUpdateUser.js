export const validateUpdateUser = (req, res, next) => {
  const { role } = req;
  const data = req.body;

  const forbiddenFields = ['email', 'userName', 'role', 'id'];
  for (const key of forbiddenFields) {
    if (key in data) {
      return res.status(400).json({ message: `${key} cannot be updated.` });
    }
  }

  if ('name' in data && data.name.trim() === '') {
    return res.status(400).json({ message: 'Name cannot be empty.' });
  }

  if (role === 'customer') {
    if ('region_id' in data && data.region_id.trim() === '') {
      return res.status(400).json({ message: 'Region is required for customers.' });
    }
  }

  if (role === 'business_owner') {
    if ('business_name' in data && data.business_name.trim() === '') {
      return res.status(400).json({ message: 'Business name is required.' });
    }
    if ('description' in data && data.description.trim() === '') {
      return res.status(400).json({ message: 'Description is required.' });
    }
  }

  next();
};
