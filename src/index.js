import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import checkToken from './authentication/auth.js';
import connect from './database/index.js';
import userRouter from './router/userRouter.js';
import marketRouter from './router/marketRouter.js';
import tbaRouter from './router/tbaRouter.js';
import gameRouter from './router/gameRouter.js';
import nftRouter from './router/nftRouter.js';
import imageRouter from './router/image.js';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());
// app.use(morgan('dev'));

app.get('/', cors({ origin: '*' }), (req, res) => {
  console.log('Getting api successfully');
  res.status(200).json({
    message: 'Getting api successfully',
  });
});
app.use('/metadata', cors({ origin: '*' }), imageRouter);

const whitelist = [process.env.FE_URL];
console.log(whitelist);

const corsOptions = {
  // eslint-disable-next-line object-shorthand
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
};

app.use(cors(corsOptions));

app.use(checkToken);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

app.use('/nft', nftRouter);
app.use('/user', userRouter);
app.use('/market', marketRouter);
app.use('/tba', tbaRouter);
app.use('/game', gameRouter);

app.listen(3003, async () => {
  await connect();
  console.log('Listening on port: http://localhost:3003');
});
