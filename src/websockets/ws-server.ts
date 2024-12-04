import { Message, MessageType } from '../types/Message.ts';
import { WebSocket, WebSocketServer } from 'ws';

import { Answer } from '../types/Answer.ts';

const BASE_URL = `${process.env.PUBLIC_BASE_URL || 'http://localhost'}:${process.env.PUBLIC_PORT || '4321'}`;

export default class WsServer {
  private wss = new WebSocketServer({ port: parseInt(process.env.PUBLIC_WS_PORT || '8080') });
  private teams: { [key: string]: WebSocket } = {};
  private host: WebSocket | null = null;

  constructor() {
    this.wss.on('connection', (ws) => {
      'Connection opened';
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
      this.setHostToken('');
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

  private async getHost() {
    return this.callApi('host');
  }

  private async setHostToken(token: string) {
    return fetch(`${BASE_URL}/api/host`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token}),
    })
    .then(resp => resp.json())
    .then((data) => console.log('Host token set', data))
    .catch((error) => console.error('Error setting host token', error));
  }

  private async callApi(url: string) {
    console.log(BASE_URL, url);
    const resp = await fetch(`${BASE_URL}/api/${url}`);
    const data = await resp.json();
    return data.message;
  }

  private async getQuiz() {
    return this.callApi('quiz');
  }

  private async getTeam(id: string) {
    return this.callApi(`team/${id}`);
  }

  private async getRound(id: number) {
    return this.callApi(`round/${id}`);
  }

  private async getQuestion(id: number) {
    return this.callApi(`question/${id}`);
  }

  private async addTeamPoints(teamId: string, points: number) {
    return await (await fetch(`${BASE_URL}/api/team/${teamId}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({points}),
    })).json();
  }

  private async answerQuestion(teamId: string, answer: Answer) {
    return await fetch(`${BASE_URL}/api/team/${teamId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer),
    });
  }

  private async authenticateHost(password: string) {
    const host = await this.getHost();
    if (host.password === password) {
      host.token = Buffer.from(new Date().toISOString()).toString('base64');
      await this.setHostToken(host.token);
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
    const hostToken = (await this.getHost()).token;
    if (message.type !== MessageType.JOIN && message.token !== hostToken) {
      console.log('Message Token', message.token, 'Host Token', hostToken);
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
          this.setHostToken(token);
          this.host = ws;
          this.sendHostMessage(new Message(MessageType.JOIN, 'host', {token}));
        } else {
          this.sendHostMessage(new Message(MessageType.ERROR, 'Invalid password'));
          ws.close(1000, 'Invalid password');
          return;
        }
        ws.onclose = () => this.setHostToken('');
        break;
      case MessageType.CHANGE_ROUND:
        try {
          const round = await this.getRound(message.message as number);
          this.broadcastMessage(new Message(MessageType.CHANGE_ROUND, '', {message: round}));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(errorMessage);
          this.sendHostMessage(new Message(MessageType.ERROR, '', {message: errorMessage}));  
        }
        break;
      case MessageType.CHANGE_QUESTION:
        try {
          const question = await this.getQuestion(message.message as number);
          this.broadcastMessage(new Message(MessageType.CHANGE_QUESTION, '', {message: question}));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(errorMessage);
          this.sendHostMessage(new Message(MessageType.ERROR, '', {message: errorMessage}));  
        }
        break;
      case MessageType.ADD_POINTS:
        const totalPoints = await this.addTeamPoints(message.teamId, message.message as number);
        this.sendMessage(new Message(MessageType.ADD_POINTS, message.teamId, {message: totalPoints}));
        break;
      default:
        console.log('unknown message', message);
        this.sendHostMessage(new Message(MessageType.ERROR, '', {message: 'Unknown Message'}));
    }
  }

  private async processTeamMessage(ws: WebSocket, message: Message) {
    const team = await this.getTeam(message.teamId);

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

          const quiz = await this.getQuiz();
          if (quiz.currentRound >= 0 && quiz.currentQuestion >= 0) {
            const round = await this.getRound(quiz.currentRound);
            const question = await this.getQuestion(quiz.currentQuestion);
            this.sendMessage(new Message(MessageType.CHANGE_ROUND, team.id, {message: round}));
            this.sendMessage(new Message(MessageType.CHANGE_QUESTION, team.id, {message: question}));
          }
        }
        
        break;
      case MessageType.ANSWER:
        await this.answerQuestion(message.teamId, message.message as Answer);
        this.host?.send(JSON.stringify(message));
        break;
      default:
        this.sendMessage(new Message(MessageType.ERROR, '', {message: 'Unknown Message'}));
    }
  }
}

const server = new WsServer();