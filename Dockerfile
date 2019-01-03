FROM node:10

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm i npm@latest -g

WORKDIR /opt
COPY package.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app

COPY . /opt/app

EXPOSE 3000

CMD ["node", "./dist/server.js"]