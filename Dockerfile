FROM node:10

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm i npm@latest -g

RUN mkdir /opt/node_app
WORKDIR /opt/node_app

COPY package.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app

COPY . /opt/node_app/app

EXPOSE 3000

RUN chown node:node -R /opt/node_app/app
USER node

CMD ["node", "./dist/server.js"]