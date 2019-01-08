import * as jwt from 'jsonwebtoken';

import User from '../models/user';

function sign(payload, options){
  const jwtToken = jwt.sign(payload, process.env.TOKEN_SECRET, options);
  return jwtToken;
}

function verify(token){
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch(err) {
    return null;
  }
}

async function protect(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({error: 'Missing authorization header'});

  const user = await verify(req.headers.authorization.split('Bearer ')[1]);

  if(!user) return res.status(401).json({error: 'Invalid authorization header'});

  req.currentUser = await User.findOne({_id: user._id})
    .select('-__v');

  next();
}

export default {
    sign: sign,
    verify: verify,
    protect: protect
};