import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { MessageDTO } from './dtos/message-client.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger('MessagesWsGateway');

  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) { }

  async handleConnection(client: Socket) {


    try {
      const user = await this.messagesWsService.checkJwtToken(client);
      this.messagesWsService.registerClient(client, user);

    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  async handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('emit-from-client')
  onMessageFromClient(client: Socket, payload: MessageDTO) {

    const userNameFromServer = this.messagesWsService.getCurrentName(client.id);

    // 1. listen client only
    /*  client.emit('message-from-server', {
       fullName: this.messagesWsService.getCurrentName(client.id),
       message: payload.message
     }); */

    // 2. listen all clients less me.
    /*  client.broadcast.emit('message-from-server', {
       id: 'Im in the server',
       message: payload.message,
     }); */

    //3. Everyone in server
    this.wss.emit('message-from-server', {
      fullName: userNameFromServer,
      message: payload.message,
    });

  }
}
