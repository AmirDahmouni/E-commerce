

module.exports=function (req, res, next) {
    // check Admin
    if (req.user && req.user.isAdmin) {
      return next();
    }
    // not an Admin unauthorized
    return res.status(401).send({ message: 'Admin Token is not valid.' });
  };