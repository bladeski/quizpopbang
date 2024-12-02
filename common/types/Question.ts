export type Question = {
  id: number;
  type: QuestionType;
  question: string;
  answer: string | boolean;
  points: number | number[];
  forKids?: boolean;
  imageUrl?: string | string[];
  answerImageUrl: string;
  answerInfo?: string;
};

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SIMPLE = "simple",
  LINKER = "linker",
}

export type SimpleQuestion = Question & {
  type: QuestionType.SIMPLE;
  answer: string;
  points: 0 | 5;
  imageUrl?: string;
}

export type MultipleChoiceQuestion = Question & {
  type: QuestionType.MULTIPLE_CHOICE;
  options: string[];
  answer: string;
  points: [10, 5, 2, 1];
  imageUrl?: string[];
}

export type TrueFalseQuestion = Question & {
  type: QuestionType.TRUE_FALSE;
  answer: boolean;
}

export type LinkerQuestion = Question & {
  type: QuestionType.LINKER;
  questions: SimpleQuestion[];
  answer: string;
  points: [20, 15, 10, 5, 2, 1]
}