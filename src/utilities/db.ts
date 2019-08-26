import * as fs from 'fs';
import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';

function init() {
  const models = fs.readdirSync(`${process.env.BASE_DIR}/models`);
  (<any>mongoose).Promise = bluebird;

  if(process.env.NODE_ENV === 'development') mongoose.set('debug', true);

  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log.bind(console, 'Database connected'))
    .catch(error => console.error.bind(console, `Error connecting to database: ${error}`));

  models.forEach(m => {
    require(`../models/${m.replace('.ts', '')}`);
  });
}

export default init;