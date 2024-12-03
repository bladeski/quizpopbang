import type { Answer, Host, Question, Quiz, Round, Team } from '.';

export default class DataServiceInterface {
  static getQuiz(): Promise<Quiz> {
    throw new Error('Method not implemented');
  }
  static getHost(): Promise<Host> {
    throw new Error('Method not implemented');
  }
  static getTeams(): Promise<Team[]> {
    throw new Error('Method not implemented');
  };
  static getRounds(): Promise<Round[]> {
    throw new Error('Method not implemented');
  };
  static getQuestions(): Promise<Question[]> {
    throw new Error('Method not implemented');
  };
  static getTeamAnswers(teamId: string): Promise<Question[]> {
    throw new Error('Method not implemented');
  };
  static getTeamAnswer(teamId: string, questionId: number): Promise<Question> {
    throw new Error('Method not implemented');
  };
  static getTeamTotalPoints(teamId: string): Promise<number> {
    throw new Error('Method not implemented');
  };
  static answerQuestion(teamId: string, answer: Answer): Promise<void> {
    throw new Error('Method not implemented');
  };
  static setHostToken(token: string): Promise<void> {
    throw new Error('Method not implemented');
  }
  static addTeamPoints(teamId: string, points: number): Promise<number> {
    throw new Error('Method not implemented');
  };
  static readJsonFile<T>(filePath: string): Promise<T> {
    throw new Error('Method not implemented');
  };
  static writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    throw new Error('Method not implemented');
  };
}