import { Quiz, Question, Result, Answer } from '../models/quiz';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/errorHandler';

let quizzes: Quiz[] = [];
let results: Result[] = [];

export class QuizService {

    createQuiz(title: string, questions: Question[]): Quiz {
        const quiz: Quiz = { id: uuidv4(), title, questions };
        quizzes.push(quiz);
        return quiz;
    }

    getQuizById(id: string): Omit<Quiz, 'questions'> & { questions: Omit<Question, 'correct_option'>[] } {
        const quiz = quizzes.find(quiz => quiz.id === id);
        if (!quiz) {
            throw new AppError(404, `Quiz with ID ${id} not found.`);
        }    
        const quizWithoutCorrectOption = {
            ...quiz,
            questions: quiz.questions.map(({ id, text, options }) => ({
                id,
                text,
                options,
            })),
        };
        return quizWithoutCorrectOption;
    }

    submitAnswer(quizId: string, userId: string, questionId: string, selectedOption: number): Answer {
        const fullQuiz = quizzes.find(quiz => quiz.id === quizId);
        if (!fullQuiz) {
            throw new AppError(404, `Quiz with ID ${quizId} not found.`);
        }
        const question = fullQuiz.questions.find(q => q.id === questionId);
        if (!question) {
            throw new AppError(404, `Question with ID ${questionId} not found in quiz ${quizId}.`);
        }
        const isCorrect = question.correct_option === selectedOption;
        const answer: Answer = { question_id: questionId, selected_option: selectedOption, is_correct: isCorrect };
        let result = results.find(r => r.quiz_id === quizId && r.user_id === userId);
        if (!result) {
            result = { quiz_id: quizId, user_id: userId, score: 0, answers: [] };
            results.push(result);
        }
        result.answers.push(answer);
        if (isCorrect) result.score++;
        return answer;
    }

    getResult(quizId: string, userId: string): Result {
        const result = results.find(r => r.quiz_id === quizId && r.user_id === userId);
        if (!result) {
            throw new AppError(404, `Result for quiz ID ${quizId} and user ID ${userId} not found.`);
        }
        return result;
    }
}
