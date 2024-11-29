import type { Answer, Question, Quiz, Round, Team } from '.';

export default interface DataServiceInterface {
  getQuiz(): Promise<Quiz>;
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team>;
  getRound(id: number): Promise<Round>;
  getRounds(): Promise<Round[]>;
  getQuestions(): Promise<Question[]>;
  getQuestion(id: number): Promise<Question>;
  getQuestionsByRound(roundId: number): Promise<Question[]>;
  getTeamAnswers(teamId: string): Promise<Question[]>;
  getTeamAnswer(teamId: string, questionId: number): Promise<Question>;
  getTeamTotalPoints(teamId: string): Promise<number>;

  answerQuestion(teamId: string, answer: Answer): Promise<void>;

  setCurrentRound(roundId: number): Promise<Round>;
  setCurrentQuestion(questionId: number): Promise<Question>;

  addTeamPoints(teamId: string, points: number): Promise<number>;
}