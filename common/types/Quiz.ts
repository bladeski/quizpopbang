export type Quiz = {
  name: string;
  rounds: number[];
  teams: string[];
  host: string;
  currentRound: number;
  currentQuestion: number;
  quizImageUrl: string;
};