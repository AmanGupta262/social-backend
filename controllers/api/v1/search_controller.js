const User = require('../../../models/user');
const Post = require('../../../models/post');
const Article = require('../../../models/article');

module.exports.search = async (req, res) => {
    try {
        const query = req.query.query;
        const posts = await Post.find({ content: { $regex: query, $options: 'i' } },);
        const articles = await Article.find({ content: { $regex: query, $options: 'i' } },);

        res.status(200).json({
            message: 'Posts and Articles',
            data: {
                posts,
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