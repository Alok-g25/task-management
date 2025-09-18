const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Email' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Password' });

        const token = createToken(user._id);
        res.cookie("token", token)
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err, "*****");
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.fetchExcludeUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id

        const total = await User.countDocuments({ _id: { $ne: currentUserId } })
        const users = await User.find({ _id: { $ne: currentUserId } })
            .select('name email')

        res.json({
            message: 'Users fetched successfully (excluding current user).',
            total,
            users
        })
    } catch (err) {
        console.error('fetchExcludeUsers error:', err)
        res.status(500).json({ message: 'Unable to fetch users.' })
    }
}

exports.getUserDetails = async (req, res) => {
    try {
      res.json({
        message: 'User details fetched successfully',
        user: req.user
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Failed to fetch user details' })
    }
  }
  