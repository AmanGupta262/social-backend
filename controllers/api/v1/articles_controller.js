const Article = require('../../../models/article');
const User = require('../../../models/user');

module.exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate({
                path: 'upvotes',
                select: 'name'
            })
            .populate({
                path: 'downvotes',
                select: 'name',
            });
        res.status(200).json({
            success: true,
            message: "All Articles",
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
}
module.exports.create = async (req, res) => {
    try {
        const user = req.user;
        req.body.user = user._id;

        const article = await Article.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Article Created",
            data: {
                article
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
module.exports.toggleUpvote = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article)
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        const user = req.user;

        const isDownVoted = article.downvotes.includes(user._id);
        if(isDownVoted){
            article.downvotes.pull(user._id);
        }
        const isUpvoted = article.upvotes.includes(user._id);

        if (!isUpvoted) {
            article.upvotes.push(user._id);
        }
        else {
            article.upvotes.pull(user._id);
        }
        await article.save();

        return res.status(200).json({
            success: true,
            message: isUpvoted ? "Unupvoted Article" : "Upvoted Article",
            data: {
                article,
                upvoted: !isUpvoted
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
}
module.exports.toggleDownvote = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article)
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        const user = req.user;

        const isUpvoted = article.upvotes.includes(user._id);
        
        if (isUpvoted) {
            article.upvotes.pull(user._id);
        }
        
        const isDownVoted = article.downvotes.includes(user._id);
        if (!isDownVoted) {
            article.downvotes.push(user._id);
        }
        else {
            article.downvotes.pull(user._id);
        }
        await article.save();

        return res.status(200).json({
            success: true,
            message: isDownVoted ? "voted Article" : "Downvoted Article",
            data: {
                article,
                downboted: !isDownVoted
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
}
module.exports.showArticle = async (req, res) => {
    try {
        const article = await Article.findOne({_id: req.params.id})
            .populate({
                path: 'upvotes',
                select: 'name'
            })
            .populate({
                path: 'downvotes',
                select: 'name',
            });

        if(!article)
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        return res.status(200).json({
            success: true,
            article
        });
        
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
}
module.exports.update = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if(!article)
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        if(req.user.id != article.user)
            return res.status(403).json({
                success: false,
                message: "You can edit only your articles"
            });
        await article.updateOne({$set: req.body});

        return res.status(200).json({
            success: true,
            message: "Article updated successfully"
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
}
module.exports.delete = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article)
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        if (req.user.id != article.user)
            return res.status(403).json({
                success: false,
                message: "You can delete only your articles"
            });
        await article.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Article deleted"
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
    }
}