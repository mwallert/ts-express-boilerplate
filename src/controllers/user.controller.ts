import { Request, Response, NextFunction, Router } from 'express';

import User from '../models/user';

class UserController {
  constructor(
    private router: Router
  ) {
    this.router.route('/users')
      .get(this.getUsers)
      .post(this.createUser);
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await User.find({});

    return res.status(200).json(users);
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const newUser = new User({
      first_name: 'Micheal',
      last_name: 'Wallert'
    });

    const savedUser = await newUser.save();

    return res.status(200).json(savedUser);
  }
}

export default UserController;