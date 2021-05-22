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

module.exports.accept = async (req, res) => {
    try {
        const friendship = await Friendship.findOne({_id: req.params.id}).populate('from_user', 'name');
        if(!friendship)
            return res.status(404).json({
                message: 'Friend request not found'
            });
        if(req.user.id != friendship.to_user)
            return res.status(403).json({
                message: 'You are not authorized to accept this request'
            });

        friendship.status = '1';
        await friendship.save();
        

        return res.status(200).json({
            message: `${friendship.from_user.name} is your friend now`,
            friendship
        });
        
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};

module.exports.remove = async (req, res) => {
    try {
        const friendship = await Friendship.findOne({ _id: req.params.id }).populate('from_user', 'name');
        if (!friendship)
            return res.status(404).json({
                message: 'Friend request not found'
            });

        if (req.user.id != friendship.to_user)
            return res.status(403).json({
                message: 'You are not authorized to do this'
            });
        const otherUsername = friendship.from_user.name;
        await User.findByIdAndUpdate(friendship.to_user, { $pull: { friends: friendship.id } });
        await User.findByIdAndUpdate(friendship.from_user, { $pull: { friends: friendship.id } });

        await friendship.deleteOne();
        
        
        return res.status(200).json({
            message: `You are no longer friend with ${otherUsername}`
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
};