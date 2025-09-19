const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Fixed cookie options for cross-site cookies (Vercel frontend + Render backend)
const cookieOptions = {
  httpOnly: true,
  secure: true,       // always true for HTTPS
  sameSite: "none",   // required for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password });
  const token = createToken(user);

  res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json({ id: user._id, name: user.name, email: user.email });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = createToken(user);

  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ id: user._id, name: user.name, email: user.email });
};

exports.logout = async (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
