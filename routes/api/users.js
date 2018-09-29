const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

router.post('/register', (req, res)=> {
    User.findOne({ email: req.body.email }).
    then((user)=> {
        if(user){
            return res.status(400).json({ email: 'Email Already Exist' });
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //ratting
                d: 'mm' //Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=> {
                    if(err){
                        throw err;
                    }

                    newUser.password = hash;
                    newUser.save().then((user)=> res.json(user))
                    .catch((err)=> console.log(err));
                })
            })

        }
    })
})

router.post('/login', (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;


    //Find user by email

    User.findOne({email})
        .then((user)=> {
            if(!user){
                return res.status(404).json({email: 'User email not found!'});
            }

            // Check password 
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // user matched 
                        const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload
                        // SIgn Token
                        jwt.sign(payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token)=> {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        return res.status(400).json({ password: 'Password Incorrent' })
                    }
                })
        })
});



module.exports = router;
