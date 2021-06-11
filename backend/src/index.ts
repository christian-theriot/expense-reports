import { App } from './app';
import { Database } from './services';

Database.connect().then(() => {
  const app = new App();
  app.start();
  console.log('Started application');
});
