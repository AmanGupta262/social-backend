const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.create = async (req, res) => {
    try {
        const post = await Post.findById(req.body.post);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            content: req.body.content,
            user: req.user._id,
            post: req.body.post
        });

        post.comments.push(comment);
        await post.save();

        return res.status(200).json({
            message: "Comment added successfully",
            data: {
                comment
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