import { Message, MessageType } from "../types/Message.ts";

export default class WsClientTeam {
  private socket: WebSocket;

  constructor(private teamId: string, private mainElement: HTMLElement) {
    this.socket = new WebSocket(`${import.meta.env.PUBLIC_WS_URL}${import.meta.env.PUBLIC_WS_PORT ? ':' + import.meta.env.PUBLIC_WS_PORT : ''}`);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  answerQuestion(answer: string) {
    this.sendMessage(new Message(MessageType.ANSWER, this.teamId, { message: answer }));
  }

  private onOpen() {
    this.sendMessage(new Message(MessageType.JOIN, this.teamId));
  }

  private onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data) as Message;

    switch (message.type) {
      case MessageType.JOIN:
        localStorage.setItem('token', message.token || '');
        this.sendEvent('ws-join', message);
        break;
      case MessageType.CHANGE_ROUND:
        this.sendEvent('ws-change-round', message);
        break;
      case MessageType.CHANGE_QUESTION:
        this.sendEvent('ws-change-question', message);
        break;
      case MessageType.ADD_POINTS:
        this.sendEvent('ws-add-points', message);
        break;
      case MessageType.ERROR:
        console.error(message.message);
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
      teamId: this.teamId
    }));
  }

  private sendEvent(eventName: string, detail: any) {
    this.mainElement.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}