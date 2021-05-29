const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../../../models/user');
const Post = require('../../../models/post');
const Article = require('../../../models/article');
const Friendship = require('../../../models/friendship');
const resetPasswordMailer = require('../../../mailers/forgot_password');

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('name email');

        return res.status(200).json({
            message: 'All users',
            data: {
                users
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}

module.exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(409).json({
                message: "User with same email id already exists"
            });
        }
        req.body.password = await bcrypt.hash(password, 10);

        const newUser = await User.create(req.body);

        return res.status(200).json({
            message: "User Created",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!user || !isValidPassword) {
            return res.status(401).json({
                message: "Invalid Username / Password"
            });
        }
        const token = await jwt.sign(
            {
                name: user.name,
                _id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            'secret',
            { expiresIn: '1d' }
        );
        return res.status(200).json({
            message: "Login Successful",
            data: {
                token: "Bearer " + token
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.createSession = async (req, res) => {

    return res.status(200).json({
        message: "Login Successful",
        data: {
            token: "Bearer " + jwt.sign(req.user.toJSON(), 'secret', { expiresIn: '1d' })
        }
    });
};

module.exports.getPosts = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User does not exists"
            });
        }

        const posts = await Post.find({ user: id });

        return res.status(200).json({
            message: "All Posts",
            data: {
                posts
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.getArticles = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User does not exists"
            });
        }

        const articles = await Article.find({ user: id });

        return res.status(200).json({
            message: "All Articles",
            data: {
                articles
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.profile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select('-password').populate('friends');

        if (!user)
            return res.status(404).json({
                message: 'User not found'
            });

        const owner = req.user.id === user.id;
        const posts = await Post.find({ user: user._id })
            .populate({ path: 'likes', select: 'name' })
            .limit(5)
            .sort({ 'createdAt': 'desc' });
        const requests = await Friendship.find({
            to_user: user._id,
            status: '0'
        });
        return res.status(200).json({
            message: 'User Profile',
            data: {
                user,
                posts,
                owner,
                requests
            }
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.sendMail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).json({
                message: 'User not found'
            });

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.expireToken = Date.now() + 120000;
        await user.save();

        resetPasswordMailer.reset(user);

        return res.status(200).json({
            message: 'Email Sent'
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}
module.exports.resetPassword = async (req, res) => {
    try {
        const token = req.body.token;
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;

        if (password != confirmPassword || token.length < 32) {
            res.status(400).json({
                message: "Enter same password"
            })
        }

        const user = await User.findOne({ resetToken: token });
        if (!user)
            return res.status(404).json({
                message: 'Invalid Token'
            });
        if (user.expireToken > Date.now()) {
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            user.resetToken = '';
            user.expireToken = Date.now();
            user.save();

            return res.status(200).json({
                message: 'Password changed successfully'
            });
        }
        user.resetToken = '';
        user.expireToken = Date.now();
        user.save();

        return res.status(400).json({
            message: 'Token is Expired'
        });       

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};