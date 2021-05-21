const User = require('../../../models/user');
const Friendship = require('../../../models/friendship');

module.exports.add = async (req, res) => {
    try {
        const fromUser = req.user;
        const toUser = await User.findOne({_id: req.params.id});
        
        if(!toUser)
            return res.status(404).json({
                message: 'User not found'
            })

        const newFriendship = await Friendship.create({
            to_user: toUser._id,
            from_user: fromUser._id
        });

        toUser.friends.push(newFriendship);
        fromUser.friends.push(newFriendship);

        await toUser.save();
        await fromUser.save();

        return res.status(200).json({
            message: "Request sent",
            data: {
                friendship: newFriendship
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