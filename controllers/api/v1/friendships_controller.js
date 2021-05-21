const User = require('../../../models/user');
const Friendship = require('../../../models/friendship');

module.exports.add = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}