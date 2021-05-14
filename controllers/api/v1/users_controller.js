const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../../models/user');
const Post = require('../../../models/post');

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

module.exports.getAllPosts = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User does not exists"
            });
        }
        
        const posts = await Post.find({user: id});

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