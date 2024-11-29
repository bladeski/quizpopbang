import type { Answer, Question, Round } from ".";

export enum MessageType {
  JOIN = 'join',
  CHANGE_ROUND = 'changeRound',
  CHANGE_QUESTION = 'changeQuestion',
  ANSWER = 'answer',
  ADD_POINTS = 'addPoints',
  ERROR = 'error',
}

export class Message {
  type: MessageType;
  teamId: string;
  token?: string;
  password?: string;
  message?: string | number | boolean | Round | Question | Answer;

  constructor(type: MessageType, teamId: string, options?: { 
    token?: string, 
    password?: string, 
    message?: string | number | boolean | Round | Question | Answer
  }) {
    this.type = type;
    this.teamId = teamId;

    if (options) {
      this.message = options.message;
      this.password = options.password;
      this.token = options.token;
    }
  }

  stringify() {
    return JSON.stringify(this);
  }
};