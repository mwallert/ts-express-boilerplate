import { Request, Response, NextFunction, Router } from 'express';
import * as _ from 'lodash';

import User from '../models/user';

import jwtModule from '../utilities/jwt';

class UserController {
  constructor(
    private router: Router
  ) {
    this.router.route('/users')
      .get(this.getUsers)
      .post(this.createUser);

    this.router.route('/users/login')
      .post(this.loginUser);
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await User.find({});

    return res.status(200).json(users);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const newUser = new User(req.body);

    const savedUser = await newUser.save();

    return res.status(200).json(savedUser);
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: any = await User.findOne({email: req.body.email.toString().toLowerCase()})
        .select('+password');

      if(!user) return res.status(401).json({error: 'Incorrect username or password'});

      user.comparePassword(req.body.password, (err, isMatch) => {
        if(err) throw err;

        if(!isMatch) return res.status(401).json({error: 'Incorrect username or password'});
        else {
          return res.status(200).json({
            token: jwtModule.sign({_id: user._id}, {expiresIn: '12h'}),
            user: _.omit(user._doc, 'password', '__v')
          });
        }
      });
    } catch(error) {
      next(error);
    }
  }
}

export default UserController;