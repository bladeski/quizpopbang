import * as fs from 'node:fs/promises';

import type { Answer, DataServiceInterface, Host, Question, Quiz, Round, Team } from "../common/types/index.ts";

import { getJsonPath } from '../common/config/Config.ts';

export default class JsonDataService implements DataServiceInterface {
  getQuiz(): Promise<Quiz> {
    return this.readJsonFile(getJsonPath('QUIZ'));
  }
  getHost(): Promise<Host> {
    return this.readJsonFile(getJsonPath('HOST'));
  }
  getTeams(): Promise<Team[]> {
    return this.readJsonFile(getJsonPath('TEAMS'));
  }
  getTeam(id: string): Promise<Team> {
    return this.getTeams()
      .then(teams => {
        const team = teams.find(team => team.id === id);
        if (team) {
          return team;
        }
        throw new Error(`Team with id ${id} not found`)}
      );
  }
  getRounds(): Promise<Round[]> {
    return this.readJsonFile(getJsonPath('ROUNDS'));
  }
  getRound(id: number): Promise<Round> {
    return this.getRounds()
      .then(rounds => {
        const round = rounds.find(round => round.id === id);
        if (round) {
          return round;
        }
        throw new Error(`Round with id ${id} not found`)}
      );
  }
  getQuestions(): Promise<Question[]> {
    return this.readJsonFile(getJsonPath('QUESTIONS'));
  }
  getQuestion(id: number): Promise<Question> {
    return this.getQuestions()
      .then(questions => {
        const question = questions.find(question => question.id === id);
        if (question) {
          return {
            ...question,
            answer: ''
          };
        }
        throw new Error(`Question with id ${id} not found`)}
      );
  }
  async getQuestionsByRound(roundId: number): Promise<Question[]> {
    const round = await this.getRound(roundId);
    return this.getQuestions()
      .then(questions => questions.filter(
        question => round.questions.includes(question.id)
      ).map(question => ({
        ...question,
        answer: ''
      })));
  }
  getTeamAnswers(teamId: string): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }
  getTeamAnswer(teamId: string, questionId: number): Promise<Question> {
    throw new Error('Method not implemented.');
  }
  getTeamTotalPoints(teamId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  getCurrentRound(): Promise<Round> {
    return this.getQuiz()
      .then(quiz => this.getRound(quiz.currentRound));
  }
  getCurrentQuestion(): Promise<Question> {
    return this.getQuiz()
      .then(quiz => this.getQuestion(quiz.currentQuestion));
  }
  answerQuestion(teamId: string, answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setHostToken(token: string): Promise<void> {
    return this.getHost()
      .then(host => {
        host.token = token;
        return this.writeJsonFile(getJsonPath('HOST'), host);
      });
  }
  setCurrentRound(roundId: number): Promise<Round> {
    return this.getQuiz()
      .then(quiz => {
        quiz.currentRound = roundId;
        return this.writeJsonFile(getJsonPath('QUIZ'), quiz)
          .then(() => this.getRound(roundId));
      });
  }
  setCurrentQuestion(questionId: number): Promise<Question> {
    return this.getQuiz()
      .then(quiz => {
        quiz.currentQuestion = questionId;
        return this.writeJsonFile(getJsonPath('QUIZ'), quiz)
          .then(() => this.getQuestion(questionId));
      });
  }
  addTeamPoints(teamId: string, points: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
  
  private async readJsonFile<T>(filePath: string): Promise<T> {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  }

  private async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}