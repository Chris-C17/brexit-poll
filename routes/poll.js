const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '698971',
    key: 'fd463010ca4a6e83b28c',
    secret: '172eb4c95dfe5b8954d0',
    cluster: 'eu',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({success: true, votes: votes}));
});

router.post('/', (req, res) => {
    const newVote = {
        option: req.body.option,
        points: 1
    }

    new Vote(newVote).save().then(vote => {
        pusher.trigger('brexit-poll', 'brexit-vote', {
            // request vote from body of form
            option: vote.option,
            points: parseInt(vote.points)
        });

        return res.json({ success: true, message: 'Thanks for voting!'});
    });
});

module.exports = router;