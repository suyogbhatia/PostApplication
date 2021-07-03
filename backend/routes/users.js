const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require('bcrypt')   //Package for encrypting passwords
const jwt = require('jsonwebtoken')  // package to create and verify web tokens

router.post('/signup', async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    password: password
  })
  try {
    const result = await user.save()
    res.status(201).json({
      message: 'User saved successfully',
      result: result
    })
  } catch (err) {
    res.status(501).json({
      error: err
    })
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const passwordCheck = await bcrypt.compare(req.body.password, user.password)
    if (!user || !passwordCheck) {  //if there isn't any user or the password is invalid then qw'll throw an error
      res.status(401).json({
        message: 'Authentication failed'
      })
    }
    const token = jwt.sign(
      { email: user.email, id: user._id },
      'secret_long_private_password', //how long the token will last
      { expiresIn:'1h' }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    })
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: 'Authentication failed'
    })
  }

})


module.exports = router
