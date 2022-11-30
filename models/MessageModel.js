const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    messagedBy: {
        type: String,
        enum: ['user', 'agent'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
    },
    
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Message', MessageSchema)
