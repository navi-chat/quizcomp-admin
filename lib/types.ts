export type CreateQuizType = {
    name: string;
    subjects: string[];
    date: string;
    thumbnail: File;
}

export type QuizType = {
    name: string;
    id: string;
    subjects: string[];
    date: string;
    thumbnail: string;
    status: "draft"|"upcoming"|"live"|"finished";
}

export type CreateRoundType = {
    name: string;
    time_per_question: number;
}

export type RoundType = {
    name: string;
    id: string;
    quiz_id: string;
    index: number;
    created_at: string;
    question_count: number;
    time_per_question: number;
}

export type CreateQuestionType = {
    statement: string;
    options: object;
    correct_answer: string;
    max_points: number;
    round_id: string;
}

export type QuestionType = {
    id: string;
    statement: string;
    round_id: string;
    index: number;
    options: JSON;
    correct_answer: string;
    max_points: number;
}