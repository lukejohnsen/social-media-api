const User = require('../models/User');
const Thought = require('../models/Thought');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then((dbUsers) => res.json(dbUsers))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getSingleUser({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then((dbSingleUser) => {
            if (!dbSingleUser) {
                res.status(404).json({ message: 'No user found with this id!" '});
                return;
            }
            res.json(dbSingleUser)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true
        })
        .then((dbUpdatedUser) => {
            if (!dbUpdatedUser) {
                res.status(404).json({ message: 'Cannot find user with this id!'});
                return;
            }
            res.json(dbUpdatedUser);
        })
        .catch((err) => res.status(400).json(err));
    },

    deleteUser({ params}, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbDeletedUser => {
            if (!dbDeletedUser) {
                return res.json({ message: 'Cannot find user with this id! '})
            }
            Thought.deleteMany({ _id: { $in: dbDeletedUser.thoughts } })
            .then(res.json({ message: 'Thoughts associated with this user have been deleted' }))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    createUser({ body }, res) {
        User.create(body)
        .then((dbCreatedUser) => res.json(dbCreatedUser))
        .catch((err) => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            {
                new: true,
                runValidators: true
            }
        )
        .then((dbAddedFriend) => {
            if (!dbAddedFriend) {
                res.status(404).json({ message: 'Cannot find user with this id!' })
                return;
            }
            res.json(dbAddedFriend);
        })
        .catch((err) => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then(dbRemovedFriend => res.json(dbRemovedFriend))
        .catch(err => res.json(err));
    }
};

module.exports = userController;