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