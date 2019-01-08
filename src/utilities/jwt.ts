import * as jwt from 'jsonwebtoken';

import User from '../models/user';

const secret = process.env.TOKEN_SECRET;

function sign(payload, options) {
  const jwtToken = jwt.sign(payload, secret, options);
  return jwtToken;
}

function verify(token) {
  try {
    return jwt.verify(token, secret);
  } catch(err) {
    return null;
  }
}

async function protect(req, res, next) {
  if(!req.signedCookies.auth_token) return res.status(401).json({error: 'Access denied.'});

  const user = await verify(req.signedCookies.auth_token);

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