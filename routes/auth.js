// We will use router here.
//Middleware fetchuser wala
const fetchuser = require('../Middleware/fetchUser')

const Cookies = require('universal-cookie')
const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
//for the password protection
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "JAISHREERAM"

// ROUTE 1: Create a user using :POST "/api/auth/createuser". Doesn't required authentication

//We don't want any error by putting wrong fields so we will work on this also
//We should have good validations example name ki jagah name hi ho ,,,....email ke jagah email hi ho.... 
router.post('/createuser',
    body('name', 'Enter a valid name of length min:4').isLength({ min: 4 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        let success = false;
        const salt = await bcrypt.genSalt(10);
        // res.send("Jai shree RAm")

        // const user = User(req.body)
        //If errors return bad request....
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //user.save()
        // res.send(req.body)
        // // console.log(req.body)
        try {

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "Sorry a user with this email  already exists" })
            }
            const secpass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                password: secpass,
                email: req.body.email
            })
            const data = {
                user: {
                    id: user.id
                }

            }
            success = true
            const authtoken = jwt.sign(data, JWT_SECRET)
            // res.cookie('authtoken', authtoken, { httpOnly: true, secure: true, sameSite: 'none' });

            res.json({ "success": success, "authtoken": authtoken })

        }

        catch (error) {
            console.error(error.message)
            res.status(500).json({success:false,"result":"INTERNAL SERVER ERROR"})
        }

    })


//ROUTE 2: For Authentication: POST :"/api/auth/login":

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        // console.log("The user we get is:", user)
        if (!user) {
            success = false
            return res.status(400).json({ error: "Please try2 login with correct credentials" });
        }
        // console.log("the password is: ", password, "and the user: ", user.password)

        const passwordCompare = await bcrypt.compare(password, user.password)
        // (user.password === password) ? 'true' : 'false'



        // console.log("the passwordcomparison is:", passwordCompare)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        else {

            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = await jwt.sign(data, JWT_SECRET);
            success = true;

            res.json({ success, authtoken })
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({success:false,"result":"INTERNAL SERVER ERROR"});
    }


});


// // ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.json({success:true,"result":user})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success:false,"result":"INTERNAL SERVER ERROR"});
    }
})
module.exports = router
