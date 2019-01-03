import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import * as helmet from 'helmet';

dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.env' : '.env.prod' });

import routeBuilder from './utilities/route-builder';
import init from './utilities/db';

init();

const app = express();
app.use(helmet());

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

routeBuilder(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  const notFoundError: any = new Error('Resource not found');
  notFoundError.status = 404;
  next(notFoundError);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.render('error', {
    title: 'Error Response',
    message: error.message,
    error: app.get('env') === 'development' ? error : ''
  });
});

export default app;