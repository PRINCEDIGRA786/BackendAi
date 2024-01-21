const axios = require('axios');
const express = require('express')
const { OpenAI } = require('openai')
const Ques = require('../models/QuesAns');
const fetchuser = require('../Middleware/fetchUser');
const router = express.Router();


const fun = async (prompt) => {
    const apiKey = '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'; // Replace with your actual OpenAI API key


    const openai = await new OpenAI({
        apiKey: apiKey,
    });

    const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log('The response is: ', response)
    return response.choices[0].text;


}

// For checking whether present in the mongo if not 
// chatgpt se pucho and mongo me dalooo jie:

router.post('/', fetchuser, async (req, res) => {
    const ques = await Ques.find({ question: req.body.question })
    // console.log(ques)
    if (ques.length == 0) {
        const { question, answer } = req.body

        try {
            // let ans = await fun(question);
            let ans = "I'm a chatbot not here for the feeling vddeee brother"
            const que = new Ques({
                question, answer: ans, user: req.user.id
            })
            const savedques = await que.save();
            // console.log(savedques)
            res.json([savedques])

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    }

    else {

        res.json(ques)
    }

})

router.get('/fetchallques', fetchuser, async (req, res) => {
    if (req.user.id) {
        const ques = await Ques.find({ user: req.user.id })
        res.json(ques)
    }
    else {
        res.json([])
    }
})

router.delete('/delete', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        const ques = await Ques.find({ question: req.body.question })
        // console.log(ques)
        if (ques.length == 0) { return res.status(404).send("Not Found") }


        var que = await Ques.findOneAndDelete({ "question": req.body.question })
        res.json({ "Success": "ques has been deleted", ques: que });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;