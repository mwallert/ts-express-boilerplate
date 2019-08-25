## Express Typescript Boilerplate

This repository serves as a starting point for a Node & Express app written with Typescript! It includes a Dockerfile and docker-compose.yml file ready for development! The Dockerfile will run on Node version 10.x (latest) and `npm install` on the container leaving your working directory clean! Just run `docker-compose up` and you should be up and running on [localhost:3000](http://localhost:3000)! The typescript compiler will take care of watching your files and automatically restart node for you!

### Requirements:

**Docker**, **Docker Compose**

Installing docker on different operating systems:
- Mac: [Docker Installation for Mac](https://docs.docker.com/docker-for-mac/install/)
- Ubuntu: [Docker Installation for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- Windows: [Docker Installation for Windows Requires Windows Pro](https://docs.docker.com/docker-for-windows/install/)
- Homebrew: `brew cask install docker` [Stackoverflow Resource](https://stackoverflow.com/questions/40523307/brew-install-docker-does-not-include-docker-engine)

Install docker compose:
- [Docker compose installation instructions](https://docs.docker.com/compose/install/)

### Using The Docker Cli

Docker for the most part is run from the terminal, the docker cli is fairly straight forward.

Docker cli documentation:
- [Docker Cli](https://docs.docker.com/engine/reference/commandline/cli/)

### API Beakdown And Notes

#### Environment Files

Depending on what environment the application is running in, the process.env file is mounted with different values. The application looks for a `.env` file when running in development. Note that in the Dockerfile the application is defaulted to production, and is run in development when using docker-compose. Here are the current keys required in the environment file:

```
BASE_DIR
MONGO_URI
TOKEN_SECRET
COOKIE_SECRET
```

Be sure to create these files after cloning the project. Note that the Docker container is using the following directory as the root for the application: `/opt/node_app/app`

#### Controllers & Routes

The current controller class handles routing in the constructor. Looking into `utilities/route-builder.ts` will show that we are looking into the `controllers` directory and reading all the files into an array. From there we pass the router directly into the controller constructor, to mount all the routes to the application automatically! Anytime a new controller is added the app will pick it up and attach any given routes. Use the existing controller as a template for any additional controllers!

#### Route Protection

All routes are protected by jwt authentication (see authentication below). If you need a route to be unprotected for some reason, simply add it to the following block of code in `app.ts`:

```
app.use((req: Request, res: Response, next: NextFunction) => {
  const unprotectedRoutes: UnprotectedRoute[] = [
    {path: '/api/v1/users/login', method: 'POST'},
    {path: '/api/v1/users', method: 'POST'}
  ];

  const unprotectedRequest = unprotectedRoutes.find(route => req.path === route.path && req.method === route.method);

  if(unprotectedRequest) next();
  else jwtModule.protect(req, res, next);
});
```

The block above is used to protect all routes by default, and only allow specific routes/methods to go through the api without checking for authentication cookies. Simply add the path (route name) and method (GET, POST, PUT, DELETE) to whitelist a route/method.

#### Database

The current implementation is with mongodb and mongoose. This can easily be switched out for any db, simply by changing the `db.ts` module. The module will read all of the models from the models directory, and attach them to the app.

#### Express Views

The app is currently using [Pug](https://github.com/pugjs/pug) as the template engine. This allows for error rendering, emails and more! The syntax is a little weird if you are used to just html5, but it makes for easier template building (imo).

#### Authentication

JWT (jsonwebtoken) is the current method of authentication. When logging into the system simply add a cookie to the response containing the token. There is an example of this in the `users.controller.ts` handling login. When a request comes in through the application, the app checks for an `auth_token` in the signed cookies to allow for access to the api. If the cookie is not present then a `401` response status is returned and the request dies there.

#### Building The Docker Container For Deployment

Deploying the app is extremely simple thanks to Docker! The application is currently set to read the NODE_ENV and attach a different env file accordingly. If the application is running in `development` mode, the path to the env file is `.env`, otherwise it will expect it to be inserted through the process dynamically (EB uses the panel to store environment variables as an example). The Dockerfile is set to build in production mode automatically, this is only overwritten during development when using the `docker-compose.yml` file. Run the following commands from the root of the project to build the container:

1. Run `tsc` to compile your files down to `js` for deployment.
2. Log in to your docker repository from the command line.
3. `docker build -t express-boilerplate .`
    - This will build the docker container locally! The app will automatically default to production mode.
4. `docker tag express-boilerplate:<version> <docker-repository-url>/express-boilerplate:<version>`
    - This command will tag the built container for versioning of deployments. This allows you to be sure you're pulling the correct version in production. Be sure to specify the version! An example could be **express-boilerplate:v1**
5. `docker push <docker-repository-url>/express-boilerplate:<version>`
    - This command will push the built container to your docker repository so it can be pulled into your production/staging environment!
6. From here you can use whatever you like to deploy, here are some options:
    - [Elasticbeanstalk](https://aws.amazon.com/elasticbeanstalk/) AWS Elasticbeanstalk has built in docker support. Just setup your Dockerrun.aws.json file and run `eb deploy`!
    - [ElasticContainerService](https://aws.amazon.com/ecs/) AWS ElasticContainerService (ECS) is a swarm management tool built for docker.

