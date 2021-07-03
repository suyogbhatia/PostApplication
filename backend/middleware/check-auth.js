const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_long_private_password');
    req.userData = { email: decodedToken.email, userId: decodedToken.id }
    next();  //will move to next middleware if token is verified
  } catch (err) {
    res.status(401).json({
      message: 'Auth Failed'
    })
  }
}
