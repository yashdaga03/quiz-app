import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
