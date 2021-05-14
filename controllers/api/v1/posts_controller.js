const Post = require('../../../models/post');
const User = require('../../../models/user');

module.exports.create = async (req, res) => {
    try {
        const user = req.user;
        req.body.user = user._id;

        const post = await Post.create(req.body);

        return res.status(200).json({
            message: "Post Created",
            data: {
                post
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