const router = require('express').Router();
const bcrypt=require('bcryptjs');
const secret=require('./Secret.js');
const authorize=require('./authenticate-middleware');
const jwt=require('jsonwebtoken');
const db=require('../database/dbConfig');

router.post('/register', (req, res) => {
  if(req.body.username){
    const user=req.body;
    const hash=bcrypt.hashSync(user.password,5);
    user.password=hash;
    db('users').insert(user)
    .then(id=>res.status(201).json(`You're successfully registered, here is your id: ${id}`))
    .catch(err=> res.status(500).json(err))
  } else {
    res.status(403).json('Please provide a username')
  }
  
});

router.delete('/delete', authorize, (req,res)=>{
  const {id}=req.body;
  db('users').delete().where('id', id)
  .then(id=>res.status(200).json(`Successfully delete the user with id : ${id}`))
  .catch(err=> res.status(500).json(err))
})

router.get('/', (req,res)=>{
  db('users')
  .then(user=>res.status(200).json(user))
  .catch(err=> res.status(500).json(err))
})

router.post('/login', (req, res) => {
  const user=req.body;
  if(user.username){
    db('users').where({username:user.username}).first()
    .then(foundUser=> {
       if(foundUser && bcrypt.compareSync(user.password,foundUser.password)){
          const token=generateToken(foundUser);
          res.status(201).json({
            message:`Welcome back ${foundUser.username}!`,
            token})
       } else {
         res.status(403).json(`Invalid authentication`)
       }})
    .catch(err => res.status(500).json(`Can't find an existing username in the database`))
  } else {
    res.status(403).json(`Please provide a username`)
  }
});

const generateToken=(user)=>{
  const payload={
    subject: user.id,
    username: user.username
  };

  const options={
    expiresIn: '1h',
  };

  return jwt.sign(payload,secret.jsonSecrets,options);
}

module.exports = router;
