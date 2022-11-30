const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    priority: {
        type: Number,
        required: true,
        default: 1
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Thread', ThreadSchema)
