import express, { Application, NextFunction, Request, Response } from 'express';
import cors from "cors";
import notFound from './app/utils/notFound';
const app: Application = express();


const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Wrold')
  });


app.use(notFound);
  
export default app;

