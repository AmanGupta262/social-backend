const User = require('../../../models/user');
const Post = require('../../../models/post');
const Article = require('../../../models/article');

module.exports.searchPost = async (req, res) => {
    try {
        const query = req.query.query;
        const posts = await Post.find({ content: { $regex: query, $options: 'i' } },);
        if(!posts){
            return res.status(200).json({
                success: false,
                message: 'No posts found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Search Result',
            data: {
                posts
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
};
module.exports.searchArticle = async (req, res) => {
    try {
        const query = req.query.query;
        const articles = await Article.find({ content: { $regex: query, $options: 'i' } },);

        res.status(200).json({
            success: true,
            message: 'Search Result',
            data: {
                articles
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
};
module.exports.searchUser = async (req, res) => {
    try {
        const query = req.query.query;
        const users = await User.find({ name: { $regex: query, $options: 'i' } }).select('name email');

        res.status(200).json({
            success: true,
            message: 'Search Result',
            data: {
                users
            }
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
};