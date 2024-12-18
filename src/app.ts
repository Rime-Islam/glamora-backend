import express, { Application, NextFunction, Request, Response } from 'express';
import cors from "cors";
import notFound from './app/utils/notFound';
import router from './app/routes';
import errorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();


const corsOptions = {
    origin: "https://glamora-frontend.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Wrold')
  });

app.use(errorHandler);
app.use(notFound);
  
export default app;

