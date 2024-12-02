export type Answer = {
  id: number;
  givenAnswer: string;
  isCorrect: boolean;
  points: number;
};

export type Answers = {
  roundId: number;
  answers: Answer[];
};