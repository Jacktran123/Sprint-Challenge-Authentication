
const jwt=require('jsonwebtoken');
const secret=require('./Secret');

module.exports = (req, res, next) => {
  const token=req.headers.authorization;
  jwt.verify(token,secret.jsonSecrets, (decoded, err)=>{
    if(err){
      res.status(403).json(`Invalid token`)
    } else {
      const decodedJWT=decoded;
      console.log(decodedJWT);
      next();
    }
  })
};
