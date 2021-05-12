const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../../models/user');

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