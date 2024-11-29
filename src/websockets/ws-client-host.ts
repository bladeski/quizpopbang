import { Message, MessageType } from "../types/Message.ts";

export default class WsClientHost {
  private socket: WebSocket;
  private token: string = localStorage.getItem('token') || '';

  constructor(password: string, private mainElement: HTMLElement) {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onopen = () => this.onOpen(password);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  startQuiz() {
    this.sendMessage(new Message(MessageType.CHANGE_ROUND, 'host', { message: 0 }));
    this.sendMessage(new Message(MessageType.CHANGE_QUESTION, 'host', { message: 0 }));
  }

  nextQuestion() {
    this.sendMessage(new Message(MessageType.CHANGE_QUESTION, 'host', { message: 1 }));
  }

  private onOpen(password: string) {
    this.sendMessage(new Message(MessageType.JOIN, 'host', { password }));
  }

  private onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data) as Message;

    switch (message.type) {
      case MessageType.JOIN:
        this.token = message.token || '';
        localStorage.setItem('token', message.token || '');
        this.sendEvent('ws-join', message);
        break;
      case MessageType.ANSWER:
        this.sendEvent('ws-answer', message);
        break;
      case MessageType.CHANGE_QUESTION:
        this.sendEvent('ws-change-question', message);
        break;
      case MessageType.ERROR:
        this.sendEvent('ws-error', message);
        break;
      default:
        console.error('Unknown message', message);
    }
  }

  private onError(event: Event) {
    console.error('Error', event);
    this.sendEvent('ws-error', event);
  }

  private onClose(event: CloseEvent) {
    console.log('Connection closed', event);
    this.sendEvent('ws-close', event);
  }

  private sendMessage(message: Message) {
    this.socket.send(JSON.stringify({
      ...message,
      teamId: 'host',
      token: this.token,
    }));
  }

  private sendEvent(eventName: string, detail: any) {
    this.mainElement.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}