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
        const quiz = this.findQuizById(id);
        return this.omitCorrectOption(quiz);
    }

    submitAnswer(quizId: string, userId: string, questionId: string, selectedOption: number): Answer {
        const quiz = this.findQuizById(quizId);
        const question = this.findQuestionById(quiz, questionId);

        const isCorrect = question.correct_option === selectedOption;
        const answer: Answer = { question_id: questionId, selected_option: selectedOption, is_correct: isCorrect };

        const result = this.findOrCreateResult(quizId, userId);
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

    private findQuizById(id: string): Quiz {
        const quiz = quizzes.find(quiz => quiz.id === id);
        if (!quiz) {
            throw new AppError(404, `Quiz with ID ${id} not found.`);
        }
        return quiz;
    }

    private findQuestionById(quiz: Quiz, questionId: string): Question {
        const question = quiz.questions.find(q => q.id === questionId);
        if (!question) {
            throw new AppError(404, `Question with ID ${questionId} not found in quiz ${quiz.id}.`);
        }
        return question;
    }

    private findOrCreateResult(quizId: string, userId: string): Result {
        let result = results.find(r => r.quiz_id === quizId && r.user_id === userId);
        if (!result) {
            result = { quiz_id: quizId, user_id: userId, score: 0, answers: [] };
            results.push(result);
        }
        return result;
    }

    private omitCorrectOption(quiz: Quiz): Omit<Quiz, 'questions'> & { questions: Omit<Question, 'correct_option'>[] } {
        return {
            ...quiz,
            questions: quiz.questions.map(({ id, text, options }) => ({
                id,
                text,
                options,
            })),
        };
    }
}
