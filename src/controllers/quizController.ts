import { Request, Response } from 'express';
import { QuizService } from '../services/quizService';

const quizService = new QuizService();

export const createQuiz = (req: Request, res: Response) => {
    const { title, questions } = req.body;
    const quiz = quizService.createQuiz(title, questions);
    res.status(200).status(201).json(quiz);
};

export const getQuizById = (req: Request, res: Response) => {
    const quiz = quizService.getQuizById(req.params.id);
    res.status(200).json(quiz);
};

export const submitAnswer = (req: Request, res: Response) => {
    const { userId, questionId, selectedOption } = req.body;
    const answer = quizService.submitAnswer(req.params.quizId, userId, questionId, selectedOption);
    res.status(200).json(answer);
};

export const getResult = (req: Request, res: Response) => {
    const result = quizService.getResult(req.params.quizId, req.params.userId);
    res.status(200).json(result);
};
