import express from 'express';
import bodyParser from 'body-parser';
import quizRoutes from './routes/quizRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(bodyParser.json());
app.use('/api', quizRoutes);
app.use(errorMiddleware);

export default app;
