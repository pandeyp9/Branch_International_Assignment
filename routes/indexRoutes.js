const express = require('express');
const AgentModel = require('../models/AgentModel');
const MessageModel = require('../models/MessageModel');
const ThreadModel = require('../models/ThreadModel');
const router = express.Router()

router.get("/", async (req, res) => {
    res.send('Ankur Raj is the best')
})

router.post("/add-agent", async (req, res) => {
    const { agentName } = req.body
    try {
        const newAgent = new AgentModel({
            agentName
        })
        newAgent.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        res.status(201).json({ message: "New Agent Created" });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/message", async (req, res) => {
    const { text, user, thread, messagedBy } = req.body

    try {
        if (!thread) {
            const agents = await AgentModel.find({}).sort({ noOfActiveThread: 'asc' })
            const agentToAssign = agents[0];

            const newThread = new ThreadModel({
                user,
                agent: agentToAssign._id,
            })

            const newMessage = new MessageModel({
                messagedBy: 'user',
                text,
                thread: newThread._id
            })

            newThread.messages.push(newMessage)

            agentToAssign.noOfActiveThread++;
            agentToAssign.threads.push(newThread);

            newThread.save((err) => {
                if (err) {
                    console.log('a')
                    return res.status(500).json({ error: "Mongo Error" })
                }
            })

            newMessage.save((err) => {
                if (err) {
                    console.log('b')

                    return res.status(500).json({ error: "Mongo Error" })
                }
            })

            agentToAssign.save((err) => {
                if (err) {
                    console.log('c')

                    return res.status(500).json({ error: "Mongo Error" })
                }
            })

            return res.status(201).json({ message: "Message send and New Agent Assigned" });

        }

        const newMessage = new MessageModel({
            messagedBy,
            text,
            thread
        })

        const findThread = await ThreadModel.findById(thread)

        findThread.messages.push(newMessage._id)
        findThread.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        newMessage.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })

        return res.status(201).json({ message: "Message sent" });

    } catch (err) {
        res.status(500).json(err);
    }

})

router.post("/resolve/:threadId", async (req, res)=> {
    const {threadId} = req.params

    try{
        const findThread = await ThreadModel.findById(threadId).populate('agent')
        
        findThread.agent.noOfActiveThread--;
        findThread.isResolved = true

        findThread.agent.save((err)=>{
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })
        findThread.save((err) => {
            if (err) {
                return res.status(500).json({ error: "Mongo Error" })
            }
        })
        return res.status(201).json({ message: "Thread Resolved" });

    }catch(err){
        res.status(500).json(err);

    }
})

router.get("/get-thread/:agentId", async (req, res) => {
    const {agentId} = req.params
    try{
        const findAgent = await ThreadModel.find({idResolved: false, agent: agentId}).populate('messages')
        findAgent.sort((a,b) => {
            return b.createdAt - a.createdAt;
        })

        res.status(201).json(findAgent)

    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/get-thread", async (req, res) => {
    try{
        const findAgent = await ThreadModel.find({idResolved: false}).populate('messages')

        findAgent.sort((a,b) => {
            return b.createdAt - a.createdAt;
        })

        res.status(201).json(findAgent)

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router