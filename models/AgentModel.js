const mongoose = require('mongoose')

const AgentSchema = new mongoose.Schema({
    agentName: {
        type: String,
        required: true
    },
    noOfActiveThread: {
        type: Number,
        required: true,
        default: 0
    },
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        default: []
    }]
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Agent', AgentSchema)
