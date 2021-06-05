const Post = require('../../../models/post');
const User = require('../../../models/user');
const Comment = require('../../../models/comment');

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate({
            path: 'likes',
            select: 'name'
        })
        .populate({
            path: 'comments',
            select: 'content user createdAt',
            populate: {
                path: 'user',
                select: 'name'
            },
            options: {
                limit: 1
            }
        });
        res.status(200).json({
            success: true,
            message: "All Posts",
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
}

module.exports.create = async (req, res) => {
    try {
        const user = req.user;
        req.body.user = user._id;

        const post = await Post.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Post Created",
            data: {
                post
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
module.exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post)
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        const user = req.user;
        const isPresent = post.likes.indexOf(user._id) > -1 ? true : false;

        if (!isPresent) {
            post.likes.push(user._id);
        }
        else {
            post.likes.pull(user._id);
        }
        await post.save();

        return res.status(200).json({
            success: true,
            message: isPresent ? "Unliked Post" : "Liked Post",
            data: {
                post,
                liked: !isPresent
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
module.exports.showPost = async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
            .populate({
                path: 'likes',
                select: 'name'
            })
            .populate({
                path: 'comments',
                select: 'content user createdAt',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            });
        res.status(200).json({
            success: true,
            message: "Post Detail",
            data: {
                post
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
module.exports.update = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        if (req.user.id != post.user)
            return res.status(403).json({
                success: false,
                message: "You can edit only your posts"
            });
        await post.updateOne({ $set: req.body });

        return res.status(200).json({
            success: true,
            message: "Post updated successfully"
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
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        if (req.user.id != post.user)
            return res.status(403).json({
                success: false,
                message: "You can delete only your posts"
            });
        let comments = await Comment.deleteMany({ post: req.params.id });
        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted"
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