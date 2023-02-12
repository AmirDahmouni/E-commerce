
const jwt=require('jsonwebtoken');

// middleware :check Authentification
module.exports=function (req, res, next){
    // get token from headers.authorisation
    
    const token = req.headers.authorization;
   
    if (token) {
      //const onlyToken = token.slice(7, token.length);
      //decode json web token
      
      jwt.verify(token, process.env.JWT_SECRET , (err, decode) => {
        
        if (err) {
          console.log("erreur")
          //invalid token
          return res.status(401).send({ message: 'Invalid Token' });
        }
        // req.user=payload(_id,name,email,isAdmin)
        req.user = decode;
        //console.log(decode)
        // next to api
        next();
      });
      
    } else {
      //token doesn't exist
      return res.status(401).send({ message: 'Token is not supplied.' });
    }
  };