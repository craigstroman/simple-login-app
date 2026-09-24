import { createConnection } from 'typeorm';
import path from 'path';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
  const app = express();

  const port = process.env.PORT;
  const nodeEnv = process.env.NODE_ENV;
  const secret: string = process.env.SECRET || '';

  app.set('trust proxy', 1);
  app.use('/static', express.static('public'));

  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'pug');

  app.use(routes);

  app.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
  });
};

main().catch((error) => {
  console.error(error);
});
