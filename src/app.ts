import { Request, Response, NextFunction } from 'express';
import { UnprotectedRoute } from './types/unprotected-route';

import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import init from './utilities/db';

if (process.env.NODE_ENV === 'development') dotenv.config({path: '.env'});

init();

import routeBuilder from './utilities/route-builder';
import jwtModule from './utilities/jwt';

const app = express();

app.options('*', cors());
const devWhitelist: RegExp[] = [
    /http:\/\/localhost(?::\d{1,5})?$/
  ],
  prodWhitelist: RegExp[] = [];

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? devWhitelist : prodWhitelist
}));

app.use(helmet({
  hidePoweredBy: true,
  noCache: true
}));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req: Request, res: Response, next: NextFunction) => {
  const unprotectedRoutes: UnprotectedRoute[] = [
    {path: '/api/v1/users/login', method: 'POST'},
    {path: '/api/v1/users', method: 'POST'}
  ];

  const unprotectedRequest = unprotectedRoutes.find(route => req.path === route.path && req.method === route.method);

  if(unprotectedRequest) next();
  else jwtModule.protect(req, res, next);
});

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