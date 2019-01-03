import * as fs from 'fs';
import { Express, Router } from 'express';

const router = Router(),
  controllers = fs.readdirSync(`${process.env.BASE_DIR}/controllers`);

const routeBuilder = (app: Express) => {
  controllers.forEach((controller: any) => {
    let ApiController = require(`../controllers/${controller.replace(/.ts/, '')}`).default;

    new ApiController(router);
  });

  app.use('/api/v1', router);
}

export default routeBuilder;