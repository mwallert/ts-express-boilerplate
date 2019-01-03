import app from './app';

const server = app.listen(app.get('port'), () => {
  console.log(`Express is running on port:${app.get('port')} in ${app.get('env')} mode.\n`);
  console.log('Press CTRL-C at anytime to stop the server.\n');
});

export default server;