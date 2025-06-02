const models = require('../../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await models.User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new models.User({
			name,
			email,
			password: hashedPassword
		});
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await models.User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const token = user.generateAuthToken();
		res.status(200).json({ token });
	} catch (error) {
		console.error('Error logging in user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.protected = (req, res) => {
	res.status(200).json({ message: 'Protected route accessed successfully', user: req.user });
}

exports.getUserProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await models.User.findById(userId).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.updateUserProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const { name, email } = req.body;
		const updatedUser = await models.User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(updatedUser);
	} catch (error) {
		console.error('Error updating user profile:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const deletedUser = await models.User.findByIdAndDelete(userId);
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}
