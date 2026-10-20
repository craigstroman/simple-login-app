import { createConnection } from 'typeorm';
import path from 'path';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import routes from './routes/index';
import { User } from './entities/USER';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
  const app = express();

  const port = process.env.PORT;
  const nodeEnv = process.env.NODE_ENV;

  const redis = new Redis();
  const RedisStore = connectRedis(session);
  const secret: string = process.env.SECRET || '';

  const javascriptFile = nodeEnv === 'development' ? '/static/js/bundle.js' : '/static/js/main.min.js';

  app.set('trust proxy', 1);
  app.use('/static', express.static('public'));

  const conn = await createConnection({
    type: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User],
  });

  await conn.runMigrations();

  app.use(
    cors({
      origin:
        nodeEnv === 'production'
          ? ['https://simple-login-app.craigstroman.com']
          : [`http://localhost:${port}`],
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(
    session({
      name: 'uid',
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
      },
      saveUninitialized: true,
      secret: secret,
      resave: false,
    }),
  );

  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'pug');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(routes);

  app.locals.javascriptFile = javascriptFile;

  app.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
  });
};

main().catch((error) => {
  console.error(error);
});
