import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { createQuiz, getQuizById, submitAnswer, getResult } from '../../controllers/quizController';
import { validateQuizCreation, validateSubmitAnswer } from '../../middlewares/validationMiddleware';

const app = express();
app.use(bodyParser.json());
app.post('/api/quizzes', validateQuizCreation, createQuiz);
app.get('/api/quizzes/:id', getQuizById);
app.post('/api/quizzes/:quizId/submit', validateSubmitAnswer, submitAnswer);
app.get('/api/quizzes/:quizId/results/:userId', getResult);

describe('Quiz API', () => {
  it('should create a quiz', async () => {
    const response = await request(app)
      .post('/api/quizzes')
      .send({
        title: 'Sample Quiz',
        questions: [
          { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should get a quiz by ID', async () => {
    const createResponse = await request(app)
      .post('/api/quizzes')
      .send({
        title: 'Sample Quiz',
        questions: [
          { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
        ],
      });
    const quizId = createResponse.body.id;

    const getResponse = await request(app).get(`/api/quizzes/${quizId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id');
  });

  it('should submit an answer and get result', async () => {
    const createResponse = await request(app)
      .post('/api/quizzes')
      .send({
        title: 'Sample Quiz',
        questions: [
          { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
        ],
      });
    const quizId = createResponse.body.id;

    const submitResponse = await request(app)
      .post(`/api/quizzes/${quizId}/submit`)
      .send({
        userId: 'user1',
        questionId: '1',
        selectedOption: 0,
      });
    expect(submitResponse.status).toBe(200);
    expect(submitResponse.body).toHaveProperty('is_correct', true);

    const resultResponse = await request(app).get(`/api/quizzes/${quizId}/results/user1`);
    expect(resultResponse.status).toBe(200);
    expect(resultResponse.body).toHaveProperty('score', 1);
  });
});
