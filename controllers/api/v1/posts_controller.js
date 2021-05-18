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
module.exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if(!post)
            return res.status(404).json({
                message: "Post not found",
            });
        const user = req.user;
        const isPresent = post.likes.indexOf(user._id) > -1 ? true: false;

        if(!isPresent){
            post.likes.push(user._id);
        }
        else{
            post.likes.pull(user._id);
        }
        await post.save();

        return res.status(200).json({
            message: isPresent ? "Unliked Post" : "Liked Post",
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