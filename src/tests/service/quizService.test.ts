import { QuizService } from '../../services/quizService';
import { AppError } from '../../utils/errorHandler';

const quizService = new QuizService();

describe('QuizService', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should create a quiz', () => {
    const title = 'Sample Quiz';
    const questions = [
      { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
    ];
    const quiz = quizService.createQuiz(title, questions);
    expect(quiz).toHaveProperty('id');
    expect(quiz.title).toBe(title);
    expect(quiz.questions).toEqual(questions);
  });
  
  it('should get a quiz by ID without correct_option', () => {
    const title = 'Sample Quiz';
    const questions = [
      { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
    ];
    const quiz = quizService.createQuiz(title, questions);
    const fetchedQuiz = quizService.getQuizById(quiz.id);
    const expectedQuiz = {
      id: quiz.id,
      title: quiz.title,
      questions: [
        { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'] },
      ],
    };
    expect(fetchedQuiz).toEqual(expectedQuiz);
    expect(fetchedQuiz.questions[0]).not.toHaveProperty('correct_option');
  });

  it('should throw error if quiz not found', () => {
    expect(() => quizService.getQuizById('non-existent-id')).toThrow(AppError);
  });

  it('should submit an answer', () => {
    const title = 'Sample Quiz';
    const questions = [
      { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
    ];
    const quiz = quizService.createQuiz(title, questions);
    const userId = 'user1';
    const answer = quizService.submitAnswer(quiz.id, userId, '1', 0);
    expect(answer.is_correct).toBe(true);
    expect(answer.question_id).toBe('1');
  });

  it('should get result for a quiz', () => {
    const title = 'Sample Quiz';
    const questions = [
      { id: '1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correct_option: 0 },
    ];
    const quiz = quizService.createQuiz(title, questions);
    const userId = 'user1';
    quizService.submitAnswer(quiz.id, userId, '1', 0);
    const result = quizService.getResult(quiz.id, userId);
    expect(result.score).toBe(1);
    expect(result.answers[0].is_correct).toBe(true);
  });
});
