const Article = require('../../../models/article');
const User = require('../../../models/user');

module.exports.create = async (req, res) => {
    try {
        const user = req.user;
        req.body.user = user._id;

        const article = await Article.create(req.body);

        return res.status(200).json({
            message: "Article Created",
            data: {
                article
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
module.exports.toggleUpvote = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article)
            return res.status(404).json({
                message: "Article not found",
            });
        const user = req.user;

        const isDownVoted = article.downvotes.indexOf(user._id) > -1 ? true : false;
        if(isDownVoted){
            article.downvotes.pull(user._id);
        }
        const isUpvoted = article.upvotes.indexOf(user._id) > -1 ? true : false;

        if (!isUpvoted) {
            article.upvotes.push(user._id);
        }
        else {
            article.upvotes.pull(user._id);
        }
        await article.save();

        return res.status(200).json({
            message: isUpvoted ? "Unupvoted Article" : "Upvoted Article",
            data: {
                article,
                upvoted: !isUpvoted
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
