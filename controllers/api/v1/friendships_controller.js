const User = require('../../../models/user');
const Friendship = require('../../../models/friendship');

module.exports.add = async (req, res) => {
    try {
        const fromUser = req.user;
        const toUser = await User.findOne({_id: req.params.id});
        
        if(!toUser)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        const friend  = await Friendship.findOne({from_user: fromUser._id, to_user: toUser._id});
        if(friend){
            return res.status(200).json({
                success: true,
                message: "Request sent",
                data: {
                    friendship: friend
                }
            });
        }
        const newFriendship = await Friendship.create({
            to_user: toUser._id,
            from_user: fromUser._id
        });

        toUser.requests.push(newFriendship);
        fromUser.requests.push(newFriendship);

        await toUser.save();
        await fromUser.save();

        return res.status(200).json({
            success: true,
            message: "Request sent",
            data: {
                friendship: newFriendship
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

module.exports.accept = async (req, res) => {
    try {
        const friendship = await Friendship.findOne({_id: req.params.id}).populate('from_user', 'name');
        if(!friendship)
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        if(req.user.id != friendship.to_user)
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to accept this request'
            });

        friendship.status = '1';
        await friendship.save();

        const fromUser = await User.findOne({ _id: friendship.from_user._id });
        const toUser = await User.findOne({ _id: friendship.to_user });

        fromUser.requests.splice(fromUser.requests.indexOf(req.params.id), 1);
        toUser.requests.splice(toUser.requests.indexOf(req.params.id), 1);

        fromUser.friends.push(friendship);
        toUser.friends.push(friendship);

        await toUser.save();
        await fromUser.save();        

        return res.status(200).json({
            success: true,
            message: `${friendship.from_user.name} is your friend now`,
            friendship
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

module.exports.remove = async (req, res) => {
    try {
        const friendship = await Friendship.findOne({ _id: req.params.id }).populate('from_user', 'name');
        if (!friendship)
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        if (req.user.id != friendship.to_user && req.user.id != friendship.from_user._id)
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to do this'
            });
        const otherUsername = friendship.from_user.name;
        await User.findByIdAndUpdate(friendship.to_user, { $pull: { friends: friendship.id } });
        await User.findByIdAndUpdate(friendship.from_user, { $pull: { friends: friendship.id } });

        await friendship.deleteOne();
        
        
        return res.status(200).json({
            success: true,
            message: `You are no longer friend with ${otherUsername}`
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