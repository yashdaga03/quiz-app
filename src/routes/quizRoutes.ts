import { Router } from 'express';
import { createQuiz, getQuizById, submitAnswer, getResult } from '../controllers/quizController';
import { validateQuizCreation, validateSubmitAnswer } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/quizzes', validateQuizCreation, createQuiz);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes/:quizId/submit', validateSubmitAnswer, submitAnswer);
router.get('/quizzes/:quizId/results/:userId', getResult);

export default router;
