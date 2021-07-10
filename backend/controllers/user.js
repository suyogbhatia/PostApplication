const User = require('../models/user')
const bcrypt = require('bcrypt')   //Package for encrypting passwords
const jwt = require('jsonwebtoken')  // package to create and verify web tokens

exports.createUser = async (req, res, next) => {
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
      message: "Invalid Authentication crendentials!"
    })
  }
}

exports.loginUser = async (req, res, next) => {
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
      process.env.JWT_KEY, //how long the token will last
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

}
