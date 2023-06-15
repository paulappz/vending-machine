import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { corsUrl, environment } from './config';



const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));


export default app;
