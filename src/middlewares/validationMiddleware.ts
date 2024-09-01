import { Request, Response, NextFunction } from 'express';

export const validateQuizCreation = (req: Request, res: Response, next: NextFunction) => {
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Invalid quiz data: title and questions are required' });
    }
    for (const question of questions) {
        if (!question.text || !Array.isArray(question.options) || question.options.length !== 4 || typeof question.correct_option !== 'number') {
            return res.status(400).json({ error: `Invalid question data for question ID ${question.id || '[missing id]'}` });
        }
    }
    next();
};

export const validateSubmitAnswer = (req: Request, res: Response, next: NextFunction) => {
    const { userId, questionId, selectedOption } = req.body;
    if (!userId || !questionId || selectedOption === undefined) {
        return res.status(400).json({ error: 'Invalid answer data: userId, questionId, and selectedOption are required' });
    }
    next();
};
