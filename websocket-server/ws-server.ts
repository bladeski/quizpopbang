import { Message, MessageType } from '../common/types/Message.ts';
import { WebSocket, WebSocketServer } from 'ws';

import { Answer } from '../common/types/Answer.ts';
import JsonDataService from '../data/JsonDataService.ts';

export default class WsServer {
  private wss = new WebSocketServer({ port: 8080 });
  private dataService = new JsonDataService();
  private teams: { [key: string]: WebSocket } = {};
  private host: WebSocket | null = null;

  constructor() {
    this.wss.on('connection', (ws) => {
      ws.on('error', console.error);
      ws.on('message', (data) => this.onReceiveMessage(ws, data.toString()));
      ws.on('close', () => this.onClose(ws));
    });
  }

  private async onReceiveMessage(ws: WebSocket, data: string) {
    const message = JSON.parse(data.toString()) as Message;

    if (message.teamId === 'host') {
      this.processHostMessage(ws, message);
    } else {
      this.processTeamMessage(ws, message);
    }
  }

  private onClose(ws: WebSocket) {
    const teamId = Object.keys(this.teams).find(key => this.teams[key] === ws);
    if (teamId) {
      delete this.teams[teamId];
    }

    else if (this.host === ws) {
      this.host = null;
      this.dataService.setHostToken('');
    }
  }

  private sendMessage(message: Message) {
    const ws = this.teams[message.teamId];
    if (ws) {
      ws.send(JSON.stringify(message));
      console.log('Sent', message);
    }
  }

  private sendHostMessage(message: Message) {
    if (this.host) {
      this.host.send(JSON.stringify(message));
      console.log('Sent', message);
    }
  }

  private async authenticateHost(password: string) {
    const host = await this.dataService.getHost();
    if (host.password === password) {
      host.token = Buffer.from(new Date().toISOString()).toString('base64');
      await this.dataService.setHostToken(host.token);
      return host.token;
    }
    return false;
  }

  private broadcastMessage(message: Message) {
    Object.keys(this.teams).forEach(key => this.teams[key]
      .send(JSON.stringify({
        ...message,
        teamId: key
      })));
    this.host?.send(JSON.stringify({
      ...message,
      teamId: 'host'
    }));
    console.log('Broadcasted', message);
  }

  private async processHostMessage(ws: WebSocket, message: Message) {
    const hostToken = (await this.dataService.getHost()).token;
    if (message.type !== MessageType.JOIN && message.token !== hostToken) {
      this.sendMessage(new Message(MessageType.ERROR, 'Invalid token'));
      ws.close(1000, 'Invalid token');
      return;
    }

    switch (message.type as MessageType) {
      case MessageType.JOIN:
        const token = await this.authenticateHost(message.password!);
        
        if (hostToken && hostToken !== '' && hostToken === message.token) {
          this.host = ws;
          this.sendHostMessage(new Message(MessageType.JOIN, 'host', {token: hostToken}));
        } else if (this.host) {
          this.sendHostMessage(new Message(MessageType.ERROR, 'Host already joined'));
          ws.close(1000, 'Host already joined');
          return;
        } else if (token && token !== '') {
          this.dataService.setHostToken(token);
          this.host = ws;
          this.sendHostMessage(new Message(MessageType.JOIN, 'host', {token}));
        } else {
          this.sendHostMessage(new Message(MessageType.ERROR, 'Invalid password'));
          ws.close(1000, 'Invalid password');
          return;
        }
        ws.onclose = () => this.dataService.setHostToken('');
        break;
      case MessageType.CHANGE_ROUND:
        try {
          const round = await this.dataService.getRound(message.message as number);
          this.broadcastMessage(new Message(MessageType.CHANGE_ROUND, '', {message: round}));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(errorMessage);
          this.sendHostMessage(new Message(MessageType.ERROR, '', {message: errorMessage}));  
        }
        break;
      case MessageType.CHANGE_QUESTION:
        try {
          const question = await this.dataService.getQuestion(message.message as number);
          this.broadcastMessage(new Message(MessageType.CHANGE_QUESTION, '', {message: question}));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(errorMessage);
          this.sendHostMessage(new Message(MessageType.ERROR, '', {message: errorMessage}));  
        }
        break;
      case MessageType.ADD_POINTS:
        const totalPoints = await this.dataService.addTeamPoints(message.teamId, message.message as number);
        this.sendMessage(new Message(MessageType.ADD_POINTS, message.teamId, {message: totalPoints}));
        break;
      default:
        console.log('unknown message', message);
        this.sendHostMessage(new Message(MessageType.ERROR, '', {message: 'Unknown Message'}));
    }
  }

  private async processTeamMessage(ws: WebSocket, message: Message) {
    const team = await this.dataService.getTeam(message.teamId);

    switch (message.type as MessageType) {
      case MessageType.JOIN:        
        if (team && this.teams[team.id]) {
          this.sendMessage(new Message(
            MessageType.ERROR, 
            team.id, 
            {message: 'Team already joined'})
          );
        } else if (team) {
          this.teams[team.id] = ws;
          const message = new Message(MessageType.JOIN, team.id, {message: team.name});
          this.sendMessage(message);
          this.host?.send(message.stringify());

          const quiz = await this.dataService.getQuiz();
          if (quiz.currentRound >= 0 && quiz.currentQuestion >= 0) {
            const round = await this.dataService.getRound(quiz.currentRound);
            const question = await this.dataService.getQuestion(quiz.currentQuestion);
            this.sendMessage(new Message(MessageType.CHANGE_ROUND, team.id, {message: round}));
            this.sendMessage(new Message(MessageType.CHANGE_QUESTION, team.id, {message: question}));
          }
        }
        
        break;
      case MessageType.ANSWER:
        await this.dataService.answerQuestion(message.teamId, message.message as Answer);
        this.host?.send(JSON.stringify(message));
        break;
      default:
        this.sendMessage(new Message(MessageType.ERROR, '', {message: 'Unknown Message'}));
    }
  }
}

const server = new WsServer();