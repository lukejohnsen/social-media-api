const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find()
        .select('-__v')
        .then((dbAllThoughts) => res.json(dbAllThoughts))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    getSingleThought({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then((dbSingleThought) => {
            if (!dbSingleThought) {
                res.status(404).json({ message: 'Cannot find Thought with this id' });
                return;
            }
            res.json(dbSingleThought);
        })
        .catch((err) => {
            console.log(err);
            res.status(400),json(err);
        });
    },

    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { username: body.username },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then((dbThought) => {
            if (!dbThought) {
                res.status(404).json({ message: 'Cannot find Thought with this id!' });
                return;
            }
            res.json(dbThought);
        })
        .catch((err) => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((dbDeletedThought) => {
            if (!dbDeletedThought) {
                res.status(404).json({ message: 'Cannot find Thought with this id!' });
                return;
            }
            res.json(dbDeletedThought);
        })
        .catch((err) => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true
        })
        .then((dbUpdatedThought) => {
            if (!dbUpdatedThought) {
                res.status(404).json({ message: 'Cannot find Thought with this id' });
            }
            res.json(dbUpdatedThought);
        })
        .catch((err) => res.status(400).json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            {
                new: true,
                runValidators: true
            }
        )
        .then((dbReaction) => {
            if (!dbReaction) {
                res.status(404).json({ message: 'Cannot find Thought with this id!' });
                return;
            }
            res.json(dbReaction)
        })
        .catch((err) => res.json(err));
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbReaction => res.json(dbReaction))
            .catch(err => res.json(err));
    },
};

module.exports = thoughtController;