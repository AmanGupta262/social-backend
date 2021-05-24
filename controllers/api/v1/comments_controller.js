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
module.exports.delete = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('post');

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if(req.user.id != comment.user || req.user.id != comment.post.user)
            return res.status(403).json({
                message: 'You are not authorized to delete this comment'
            });
        await Post.findByIdAndUpdate(comment.post, {$pull: {comments: comment.id}});
        await comment.deleteOne();

        return res.status(200).json({
            message: "Comment deleted",
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};
module.exports.toggleLike = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment)
            return res.status(404).json({
                message: "Comment not found",
            });
        const user = req.user;
        const isPresent = comment.likes.includes(user._id);

        if (!isPresent) {
            comment.likes.push(user._id);
        }
        else {
            comment.likes.pull(user._id);
        }
        await comment.save();

        return res.status(200).json({
            message: isPresent ? "Unliked Comment" : "Liked Comment",
            data: {
                post,
                liked: !isPresent
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