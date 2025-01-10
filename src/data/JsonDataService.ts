import * as fs from 'node:fs/promises';

import type { Answer, DataServiceInterface, Host, Question, Quiz, Round, Team } from "../types";
import { LinkerQuestion, MultipleChoiceQuestion, SimpleQuestion, TrueFalseQuestion } from '../types/Question.ts';

import { getJsonPath } from '../config/Config.ts';

export default class JsonDataService implements DataServiceInterface {
  static getQuiz(): Promise<Quiz> {
    return JsonDataService.readJsonFile(getJsonPath('QUIZ'));
  }
  static getHost(): Promise<Host> {
    return JsonDataService.readJsonFile(getJsonPath('HOST'));
  }
  static getTeams(): Promise<Team[]> {
    return JsonDataService.readJsonFile(getJsonPath('TEAMS'));
  }
  
  static getRounds(): Promise<Round[]> {
    return JsonDataService.readJsonFile(getJsonPath('ROUNDS'));
  }
  static getQuestions(): Promise<(SimpleQuestion | MultipleChoiceQuestion | TrueFalseQuestion | LinkerQuestion)[]> {
    return JsonDataService.readJsonFile(getJsonPath('QUESTIONS'));
  }
  static getTeamAnswers(teamId: string): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }
  static getTeamAnswer(teamId: string, questionId: number): Promise<Question> {
    throw new Error('Method not implemented.');
  }
  static getTeamTotalPoints(teamId: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  static answerQuestion(teamId: string, answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  static setHostToken(token: string): Promise<void> {
    return JsonDataService.getHost()
      .then(host => {
        host.token = token;
        return JsonDataService.writeJsonFile(getJsonPath('HOST'), host);
      });
  }
  static addTeamPoints(teamId: string, points: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
  
  static async readJsonFile<T>(filePath: string): Promise<T> {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  }

  static async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}